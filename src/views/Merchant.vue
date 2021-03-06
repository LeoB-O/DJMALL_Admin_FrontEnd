<template>
    <div class="animated fadeIn">
        <Row>
            <Col span="24">
                <h3 style="text-align:center">商家列表</h3>

            </Col>
        </Row>
        <Row>
            <Col :md="24">
                <Table :columns="columns" :data="data">
                    <template slot-scope="{ row, index }" slot="name">
                        <Input type="text" v-model="editName" v-if="editIndex === index"/>
                        <span v-else>{{ row.name }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="category">
                        <Tree @input="handleInput(event)" :data="row.category" :render="renderContent"></Tree>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <div v-if="editIndex === index">
                            <Button @click="handleSave(index)">保存</Button>
                            <Button @click="editIndex = -1">取消</Button>
                        </div>
                        <div v-else>
                            <Button @click="handleEdit(row, index)">操作</Button>
                            <Button type="warning" @click="handleDelete(row, index)">删除</Button>
                        </div>
                    </template>
                </Table>
            </Col>

        </Row>
        <Row>
            <Button v-if="this.$store.getters.roles[0]=='admin'" @click="handleAdd">添加商家</Button>
        </Row>

        <Modal v-model="modal" @on-ok="handleSubmit" @on-cancel="handleCancel">
            <Form :label-width="80">
                <FormItem label="商家名称">
                    <Input v-model="addName"></Input>
                </FormItem>
            </Form>
        </Modal>

    </div>
</template>

<script>
    import IntroChartCount from './charts/IntroChartCount';
    import IntroChartPie from './charts/IntroChartPie';
    import axios from '@/axios';

    export default {
        components: {IntroChartCount, IntroChartPie},
        name: 'dashboard',
        data() {
            return {
                modal: false,
                addName: '',
                columns: [
                    {
                        title: 'Merchant Name',
                        slot: 'name'
                    },
                    {
                        title: 'Category',
                        slot: 'category'
                    },
                    {
                        title: '操作',
                        slot: 'action'
                    }
                ],
                data: [],
                editIndex: -1,  // 当前聚焦的输入框的行数
                editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
                editAge: '',  // 第二列输入框
                editBirthday: '',  // 第三列输入框
                editAddress: '',  // 第四列输入框
                categoryIndex: -1,
                subCategoryIndex: -1,
                category: '',
                subCategory: ''
            }
        },
        created () {
            let role = this.$store.getters.roles[0];
            let id = this.$store.getters.uid;
            if (role == 'admin') {
                console.log('admin');
                axios.get('/stores').then((response) => {
                    this.data = response.data.stores.map((current) => {
                        return {
                            id: current.id,
                            name: current.name,
                            category: current.category.map((cate) => {
                                return {
                                    title: cate.name,
                                    expand: false,
                                    children: cate.subCate.map((sub) => {
                                        return {
                                            title: sub.name,
                                            goodIds: sub.goodIds
                                        }
                                    })
                                }
                            })
                        }
                    })
                })
            } else {
                console.log('else');
                axios.get('/api/user').then((response) => {
                    let merchantId = response.data.merchantId;
                    axios.get('/store?id=' + merchantId).then((response) => {
                        this.data = [{
                            id: merchantId,
                            name: response.data.name,
                            category: response.data.category.map((current) => {
                                return {
                                    title: current.name,
                                    expand: true,
                                    children: current.subCate.map((sub) => {
                                        return {
                                            title: sub.name,
                                            goodIds: sub.goodIds
                                        }
                                    })
                                }
                            })
                        }]
                    })
                })
            }

        },
        methods: {
            handleSubmit() {
                axios.get('/api/category');
                axios.put('/api/store', {name: this.addName}).then((response) => {
                    this.$router.go(0);
                });
            },
            handleDelete(row, index) {
                axios.get('/api/category');
                axios.delete('api/store?id=' + row.id).then(() => {
                    this.$router.go(0);
                })
            },
            handleAdd() {
                this.modal = true;
            },
            handleCancel() {
                this.modal = false;
            },
            handleEdit(row, index) {
                this.editName = row.name;
                this.editIndex = index;
            },
            handleInput(event) {
                console.log(event);
            },
            handleSave(index) {
                this.data[index].name = this.editName;
                if (this.categoryIndex!=-1) {
                    this.data[index].category[this.categoryIndex].title = this.category;
                }
                if(this.subCategoryIndex!=-1) {
                    this.data[index].category[this.categoryIndex].children[this.subCategoryIndex].title = this.subCategory;
                }
                let store = this.data[index]
                let payload = {
                    id: store.id,
                    name: store.name,
                    category: store.category.map((current) => {
                        return {
                            name: current.title,
                            subCate: current.children.map((child) => {
                                return {
                                    name: child.title,
                                    goodIds: child.goodIds
                                }
                            })
                        }
                    })
                };
                axios.get('/api/category');
                this.categoryIndex=-1;
                this.subCategoryIndex=-1;
                this.editIndex = -1;
                axios.post('/api/store', payload).then((response) => {
                    this.$router.go(0);
                })

            },
            getBirthday(birthday) {
                const date = new Date(parseInt(birthday));
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return `${year}-${month}-${day}`;
            },
            renderContent(h, {root, node, data}) {
                let that = this;
                if (this.editIndex != -1) {
                    return h('span', {
                        style: {
                            display: 'inline-block',
                            width: '100%'
                        }
                    }, [
                        h('span',[
                            h('Icon', {
                                props: {
                                    type: 'ios-paper-outline'
                                },
                                style: {
                                    marginRight: '8px'
                                }
                            }),
                            h('input', {
                                domProps: {
                                    value: data.title
                                },
                                on: {
                                    input: function (event) {
                                        that.$emit('input', event.target.value);
                                        let edited = false;
                                        for (let i in that.data) {
                                            for (let j in that.data[i].category) {
                                                if (i==that.editIndex && event.target._value == that.data[i].category[j].title) {
                                                    // that.data[i].category[j].title = event.target.value;
                                                    that.category = event.target.value;
                                                    that.categoryIndex = j;
                                                    edited = true;
                                                }
                                                for (let k in that.data[i].category[j].children) {
                                                    if (i==that.editIndex && event.target._value == that.data[i].category[j].children[k].title) {
                                                        // that.data[i].category[j].children[k].title = event.target.value;
                                                        if (!edited) {
                                                            that.category = that.data[i].category[j].title
                                                        }
                                                        that.subCategory = event.target.value;
                                                        that.categoryIndex = j;
                                                        that.subCategoryIndex = k;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                style: {
                                    width: '40px'
                                }
                            })
                        ]),
                        h('span', {
                            style: {
                                display: 'inline-block',
                                float: 'right',
                                marginRight: '32px'
                            }
                        }, [
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'ios-add'
                                }),
                                style: {
                                    marginRight: '8px'
                                },
                                on: {
                                    click: () => {
                                        // data.children.push({title: 'Men'});
                                        console.log(root);
                                        axios.get('/api/category').then(()=>{});
                                        for (let i in this.data) {
                                            for (let j in this.data[i].category) {
                                                if (i==that.editIndex && data.title == this.data[i].category[j].title) {
                                                    this.data[i].category.push({title: 'Test', children: [{title: 'CTest'}]});
                                                }
                                                for (let k in this.data[i].category[j].children) {
                                                    if (i==that.editIndex && data.title == this.data[i].category[j].children[k].title) {
                                                        this.data[i].category[j].children.push({title: 'CTest'});
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }),
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'ios-remove'
                                }),
                                on: {
                                    click: () => {
                                        console.log(data);
                                        axios.get('/api/category').then(()=>{});
                                        for (let i in this.data) {
                                            for (let j in this.data[i].category) {
                                                if (data.title == this.data[i].category[j].title) {
                                                    this.data[i].category.splice(j, 1);
                                                    return;
                                                }
                                                for (let k in this.data[i].category[j].children) {
                                                    if (data.title == this.data[i].category[j].children[k].title) {
                                                        this.data[i].category[j].children.splice(k, 1);
                                                        if (this.data[i].category[j].children.length==0) {
                                                            this.data[i].category.splice(j, 1);
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        // this.remove(root, node, data)
                                    }
                                }
                            })
                        ])
                    ]);
                } else {
                    return h('span', {
                        style: {
                            display: 'inline-block',
                            width: '100%'
                        }
                    }, [
                        h('span', [
                            h('Icon', {
                                props: {
                                    type: 'ios-paper-outline'
                                },
                                style: {
                                    marginRight: '8px'
                                }
                            }),
                            h('span', data.title)
                        ])
                    ]);
                }
            }
        },
        mounted() {
            const token = this.$store.getters.token;


        }
    }
</script>


<style type="text/css" scoped>
    .time {
        font-size: 14px;
        font-weight: bold;
    }

    .content {
        padding-left: 5px;
    }

    .dashboard_feature {
        text-align: center;
    }

    .demo-carousel {
        height: 600px;
        line-height: 200px;
        text-align: center;
        color: #fff;
        font-size: 20px;
        background: #506b9e;
    }

    .demo-carousel img {
        height: 100%;
        width: 100%;
    }

    h3, h4, h5 {
        margin: 12px;
    }

    h3 {
        margin-bottom: 20px;
    }

    p {
        margin: 12px;
    }

    .row-margin-top {
        margin-top: 30px;
    }

    .ivu-collapse, .ivu-collapse-item {
        border: none;
    }

    .ivu-table .demo-table-info-row td {
        background-color: #2db7f5;
        color: #fff;
    }

    .ivu-table .demo-table-error-row td {
        background-color: #ff6600;
        color: #fff;
    }

    .ivu-table td.demo-table-info-column {
        background-color: #2db7f5;
        color: #fff;
    }

    .ivu-table .demo-table-info-cell-name {
        background-color: #2db7f5;
        color: #fff;
    }

    .ivu-table .demo-table-info-cell-age {
        background-color: #ff6600;
        color: #fff;
    }

    .ivu-table .demo-table-info-cell-address {
        background-color: #187;
        color: #fff;
    }
</style>
