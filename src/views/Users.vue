<template>
    <div class="animated fadeIn">
        <Row>
            <Col span="24">
                <h3 style="text-align:center">用户列表</h3>

            </Col>
        </Row>
        <Row>
            <Col :md="24">
                <Table :columns="columns" :data="data">
                    <template slot-scope="{ row, index }" slot="name">
                        <Input type="text" v-model="editName" v-if="editIndex === index"/>
                        <span v-else>{{ row.name }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="email">
                        <Input type="text" v-model="editEmail" v-if="editIndex === index"/>
                        <span v-else>{{ row.email }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="avatar">
                        <Input type="text" v-model="editAvatar" v-if="editIndex === index"/>
                        <span v-else>{{ row.avatar }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="permission">
                        <Input v-model="editPermission" v-if="editIndex === index"></Input>
                        <span v-else>{{row.permission}}</span>
                    </template>


                    <template slot-scope="{ row, index }" slot="action">
                        <div v-if="editIndex === index">
                            <Button @click="handleSave(index)">保存</Button>
                            <Button @click="editIndex = -1">取消</Button>
                        </div>
                        <div v-else>
                            <Button @click="handleEdit(row, index)">操作</Button>
                        </div>
                    </template>
                </Table>
            </Col>

        </Row>
    </div>
</template>

<script>
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
                        title: 'Email',
                        slot: 'email',
                    },
                    {
                        title: 'Avatar',
                        slot: 'avatar'
                    },
                    {
                        title: 'Permission',
                        slot: 'permission'
                    },
                    {
                        title: '操作',
                        slot: 'action'
                    }
                ],
                data: [
                    {
                        name: '王小明',
                        permission: 18,
                        email: 'liubobotb@126.com',
                        avatar: 'test.com',
                    },
                    {
                        name: '张小刚',
                        permission: 18,
                        email: 'liubobotb@126.com',
                        avatar: 'test.com',
                    },
                    {
                        name: '李小红',
                        permission: 18,
                        email: 'liubobotb@126.com',
                        avatar: 'test.com',
                    },
                    {
                        name: '周小伟',
                        permission: 18,
                        email: 'liubobotb@126.com',
                        avatar: 'test.com',
                    }
                ],
                editIndex: -1,  // 当前聚焦的输入框的行数
                editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
                editPermission: '',
                editEmail: '',
                editAvatar: '',
                category: '',
                subCategory: ''
            }
        },
        methods: {
            handleEdit(row, index) {
                this.editName = row.name;
                this.editPrice = row.price;
                this.editCategory = row.category.cate;
                this.editSubCategory = row.category.subCate;
                this.editOptions = row.options;
                this.editIndex = index;
            },
            handleInput(event) {
                console.log(event);
            },
            handleSave(index) {
                this.data[index].name = this.editName;
                this.data[index].age = this.editAge;
                this.data[index].birthday = this.editBirthday;
                this.data[index].address = this.editAddress;
                if (this.categoryIndex != -1 && this.subCategoryIndex == -1) {
                    this.data[index].category[this.categoryIndex].title = this.category;
                } else if (this.categoryIndex != -1) {
                    this.data[index].category[this.categoryIndex].children[this.subCategoryIndex].title = this.subCategory;
                }
                this.categoryIndex = -1;
                this.subCategoryIndex = -1;
                this.editIndex = -1;
            }
        }
    }
</script>

<style scoped>

</style>
