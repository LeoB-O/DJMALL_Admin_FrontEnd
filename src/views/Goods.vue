<template>
    <div class="animated fadeIn">
        <Row>
            <Col span="24">
                <h3 style="text-align:center">商品列表</h3>

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
                        <div style="display: flex;" v-if="editIndex === index">
                            <Input type="text" v-model="editCategory" v-if="editIndex === index"/>
                            <Input type="text" v-model="editSubCategory" v-if="editIndex === index"/>
                        </div>
                        <span v-else>{{ row.category.parentCate }} - {{row.category.subCate}}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="price">
                        <Input type="text" v-model="editPrice" v-if="editIndex === index"/>
                        <span v-else>{{ row.price }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="options">
                        <div v-if="editIndex === index">
                            <div style="display: flex;" v-for="option in row.options">
                                <Input v-model="option.name"></Input>
                                <Input :key="sub.index" v-model="sub.value"
                                       v-for="sub in option.values">{{sub}},</Input>
                            </div>
                        </div>

                        <span v-else>
                            <div v-for="option in row.options">
                                <span>{{option.name}}:</span>
                                <span :key="sub.index" v-for="sub in option.values">{{sub.value}},</span>
                            </div>
                        </span>
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
            <Button @click="handleAdd">添加商品</Button>
        </Row>
        <Modal v-model="modal" @on-ok="handleSubmit" @on-cancel="handleCancel">
            <Form :label-width="80">
                <FormItem label="商品名称">
                    <Input type="text" v-model="addGood.name"></Input>
                </FormItem>
                <FormItem label="商品价格">
                    <Input type="text" v-model="addGood.price"></Input>
                </FormItem>
                <FormItem label="类别">
                    <Cascader v-model="addGood.category" :data="categoryOptions"></Cascader>
                </FormItem>
                <FormItem label="图片地址">
                    <Input v-model="addGood.image1"></Input>
                    <Input v-model="addGood.image2"></Input>
                    <Input v-model="addGood.image3"></Input>
                    <Input v-model="addGood.image4"></Input>
                    <Input v-model="addGood.image5"></Input>
                </FormItem>
                <FormItem label="拼音">
                    <Input v-model="addGood.pinyin"></Input>
                </FormItem>
                <FormItem label="英文名">
                    <Input v-model="addGood.eName"></Input>
                </FormItem>
                <FormItem label="商品选项">
                    <div style="display: flex; flex-direction: column; width: 100%;height: auto;">
                        <div style="display: flex; width: 100%; height: auto; margin: 10px 0px;" v-for="option in addGood.options"
                             :key="option.name">
                            <div style="width: 100%;">
                                <Input v-model="option.name"></Input>
                            </div>
                            <div style="display: inline-block; width: 100%;">
                                <Input v-model="value.value" :key="value.index" v-for="value in option.values"></Input>
                                <Button @click="handleAddValue(option)">添加属性值</Button>
                            </div>
                        </div>
                        <Button @click="handleAddAttr">添加属性</Button>
                    </div>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import axios from '@/axios'

    export default {
        name: "Goods",
        data() {
            return {
                columns: [
                    {
                        title: 'Name',
                        slot: 'name'
                    },
                    {
                        title: 'Category',
                        slot: 'category'
                    },
                    {
                        title: 'Price',
                        slot: 'price'
                    },
                    {
                        title: 'Options',
                        slot: 'options'
                    },
                    {
                        title: '操作',
                        slot: 'action'
                    }
                ],
                data: [
                    {
                        name: '张小刚',
                        price: 25,
                        category: {cate: 'Shoes', subCate: 'Men'},
                        options: [{
                            attrName: 'Size',
                            attrValues: [{index: 1, value: '33'}, {index: 2, value: '34'}, {index: 3, value: '35'}]
                        }, {
                            attrName: 'Color',
                            attrValues: [{index: 1, value: 'White'}, {index: 2, value: 'Yellow'}, {
                                index: 3,
                                value: 'Blue'
                            }]
                        }]
                    }
                ],
                editIndex: -1,  // 当前聚焦的输入框的行数
                editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
                editCategory: '',  // 第二列输入框
                editSubCategory: '',
                editPrice: '',
                editOptions: [],
                category: '',
                subCategory: '',
                addGood: {
                    category: [],
                    name: '',
                    price: '',
                    image1: '',
                    image2: '',
                    image3: '',
                    image4: '',
                    image5: '',
                    pinyin: '',
                    eName: '',
                    options: [{
                        name: 'test',
                        values: [{index: 1, value:'test-1'}],
                    }],
                },
                categoryOptions: [{
                    label: 'Shoes',
                    value: 'shoes',
                    children: [{
                        label: 'Men',
                        value: 'Women'
                    }]
                }],
                modal: false
            }
        },
        methods: {
            handleAdd() {
                this.modal = true
                axios.get('/api/category');
            },
            handleDelete(row, index) {
                axios.delete('/api/good?id='+row.id).then((response) => {
                    this.$router.go(0)
                })
                axios.get('/api/category');
            },
            handleSubmit() {
                let options = this.addGood.options.map((current) => {
                    return {
                        name: current.name,
                        values: current.values.map((value) => {
                            return value.value
                        })
                    }
                });
                let parentCate = this.addGood.category[0];
                let subCate = this.addGood.category[1];
                axios.put('/api/good', {
                    name: this.addGood.name,
                    price: this.addGood.price,
                    category: {
                        parentCate: parentCate,
                        subCate: subCate
                    },
                    images: [
                        this.addGood.image1,
                        this.addGood.image2,
                        this.addGood.image3,
                        this.addGood.image4,
                        this.addGood.image5,
                    ],
                    pinyin: this.addGood.pinyin,
                    eName: this.addGood.eName,
                    options: options,
                    merchantID: ''  //TODO get merchant id from page
                })
                this.addGood={
                    category: [],
                        name: '',
                        price: '',
                        options: [{
                        name: '',
                        values: [{index: 1, value:''}],
                    }],
                }
                axios.get('/api/category');
                this.$router.go(0)
            },
            handleCancel() {
                this.addGood={
                    category: [],
                    name: '',
                    price: '',
                    options: [{
                        name: '',
                        values: [{index: 1, value:''}],
                    }],
                }
            },
            handleAddAttr() {
                this.addGood.options.push({name: '', values: [{index: 1, value: ''}]})
                axios.get('/api/category');
            },
            handleAddValue(option) {
                option.values.push({index: option.values[option.values.length-1].index + 1, value: ''})
                axios.get('/api/category');
            },
            handleEdit(row, index) {
                this.editName = row.name;
                this.editPrice = row.price;
                this.editCategory = row.category.parentCate;
                this.editSubCategory = row.category.subCate;
                this.editOptions = row.options;
                this.editIndex = index;
            },
            handleInput(event) {
            },
            handleSave(index) {
                this.data[index].name = this.editName;
                this.data[index].price = this.editPrice;
                this.data[index].options = this.editOptions.map((current) => {
                    return {
                        name: current.name,
                        values: current.values.map((value) => {
                            return value.value
                        })
                    }
                });
                this.data[index].category.parentCate = this.editCategory;
                this.data[index].category.subCate = this.editSubCategory;
                this.categoryIndex = -1;
                this.subCategoryIndex = -1;
                this.editIndex = -1;
                axios.post('/api/good', this.data[index]);
                axios.get('/api/category');
                this.$router.go(0)
            }
        },
        async created() {
            let user = await axios.get('/api/user');
            let merchantId = user.data.merchantId;
            let role = this.$store.getters.roles[0];
            axios.get('/goods').then((response) => {
                this.data = response.data.goods.map((current) => {
                    return {
                        id: current.id,
                        name: current.name,
                        price: current.price,
                        category: current.category,
                        merchantId: current.merchantID,
                        options: current.options.map((option) => {
                            return {
                                name: option.name,
                                values: option.values.map((value, index) => {
                                    return {
                                        index: index,
                                        value: value
                                    }
                                })
                            }
                        })
                    }
                });
                let count = 0
                let l = this.data.length;
                for (let g = 0; g < l; g++) {
                    if (role == 'merchant' && this.data[count].merchantId != merchantId) {
                        this.data.splice(count, 1);
                        console.log(this.data[count].merchantId)
                        console.log(merchantId)
                        console.log(this.data[count].merchantId != merchantId)
                    } else {
                        count++;
                    }
                }
                console.log(this.data)
            });
            axios.get('/categories').then((response) => {
                this.categoryOptions = response.data.menu.map((current) => {
                    return {
                        label: current.name,
                        value: current.name,
                        children: current.value.map((sub) => {
                            return {
                                label: sub,
                                value: sub
                            }
                        })
                    }
                })
            })
        }
    }
</script>

<style scoped>

</style>
