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
            <Input type="text">
                <div slot="prepend">商品名称</div>
            </Input>
            <Input type="text">
                <div slot="prepend">价格</div>
            </Input>

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
                modal: false
            }
        },
        methods: {
            handleAdd() {
                this.modal = true
            },
            handleDelete(row, index) {

            },
            handleSubmit() {

            },
            handleCancel() {

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
                console.log(event);
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
                console.log(this.data[index].options)
                this.data[index].category.parentCate = this.editCategory;
                this.data[index].category.subCate = this.editSubCategory;
                this.categoryIndex = -1;
                this.subCategoryIndex = -1;
                this.editIndex = -1;
                axios.post('/api/good', this.data[index]);
                console.log(this.data[index]);
                this.$router.go(0)
            }
        },
        created() {
            axios.get('/goods').then((response) => {
                this.data = response.data.goods.map((current) => {
                    return {
                        id: current.id,
                        name: current.name,
                        price: current.price,
                        category: current.category,
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
                console.log(this.data);
            });
        }
    }
</script>

<style scoped>

</style>
