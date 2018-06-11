/**
 * @authors  xt
 * @date     2018/06/11
 * @describe table增删改查
 */
'use strict';
import React from 'react';
import {Table, Form, Divider, Popconfirm, Input, Select, Button, message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

export class EditableTable extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            data:[],
            editingKey:'', //正在编辑的某一项的key
            count:0,   //data的数量，用于添加key值
        };

        this.sexOption = [
            {
                id:1,
                name:'男',
            },
            {
                id:2,
                name:'女',
            }
        ]
    }

    // 前端静态设置data
    componentWillMount(){
        const data = [
            {
                key:0,
                name:'name1',
                age:23,
                sex:1,    //1为男，2位女
                editing:false,
            },
            {
                key:1,
                name:'name2',
                age:22,
                sex:2,    //1为男，2位女
                editing:false,
            }
        ];
        this.setState({
            data:data,
            count:data.length
        })
    };

    // 后台请求回来的data
    /*componentWillReceiveProps(nextProps){
    	if(this.props.data !== nextProps.data){
    		const nextData = nextProps.data.map((item,index)=>{
    			return {...item,key:index,editing:false}
    		})
    		this.setState({
    			data:nextProps.nextData,
    			count:nextData.length,
    		})
    	}
    };*/

    //点击添加
    handleAdd = () => {
        const {data,editingKey,count} = this.state;
        if(editingKey){
            message.warning('有正在编辑的信息！');
            return false;
        }
        const newData = {
            key: count,
            name:'',
            age:'',
            sex:'',
            editing:true
        };
        this.setState({
            data:[
                ...data,
                newData
            ],
            editingKey:newData.key,
            count:count+1
        })
    };

    //点击保存
    handleSave = (record) => {
        let edited = record;
        this.props.form.validateFields((error,values)=>{
            if(error){
                return;
            }else{
                edited = {
                    ...record,
                    ...values,
                    editing:false,
                };
                const newDate = this.state.data.map((item)=>{
                    return item.key !== edited.key ? item : edited
                });   //替换编辑的那一项
                this.setState({
                    data:newDate,
                    editingKey: ''
                })
            }
        })
    };

    //点击删除
    handleDelete = (record) => {
        const newData = this.state.data.filter((item)=>{
            return item.key !== record.key
        });
        this.setState({ data:newData,editingKey: '' });
    };

    //点击编辑
    handleEdit = (record) => {
        if(this.state.editingKey){
            message.warning('有正在编辑的信息！');
            return false;
        }
        record.editing = true;
        this.setState({ editingKey: record.key });
    };

    isEditing = (record) =>{
        return record.key === this.state.editingKey;
    };

    renderInput = (text,record,dataIndex) =>{
        const {getFieldDecorator} = this.props.form;
        const {editing} = record;
        return(<div>
            <FormItem>
                {
                    editing ?
                        getFieldDecorator(dataIndex,{
                            initialValue:text
                        })(<Input placeholder='请输入'/>)
                        : text
                }
            </FormItem>
        </div>)
    };

    renderSelect = (text,record,dataIndex) =>{
        const {getFieldDecorator} = this.props.form;
        const {editing} = record;
        let defaultSex;
        if(!text){
            defaultSex = '';
        }else if(text === 1){
            defaultSex = '男';
        }else if(text === 2){
            defaultSex = '女';
        }
        return(<div>
            <FormItem>
                {
                    editing ?
                        getFieldDecorator(dataIndex,{
                            initialValue:text ? text : undefined
                        })(
                            <Select placeholder='请选择' style={{width:'100%'}}>
                                {
                                    this.sexOption.map((item,index)=>{
                                        return (
                                            <Option value={item.id} key={index}>{item.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )
                        : defaultSex
                }
            </FormItem>
        </div>)
    };

    render(){
        const columns = [
            {
                key:'name',
                title:'name',
                dataIndex:'name',
                width:'25%',
                editable:true,
                render:(text,record) => this.renderInput(text,record,'name'),
            },
            {
                key:'sex',
                title:'sex',
                dataIndex:'sex',
                width:'25%',
                editable:true,
                render:(text,record) => this.renderSelect(text,record,'sex'),
            },
            {
                key:'age',
                title:'age',
                dataIndex:'age',
                width:'15%',
                editable:true,
                render:(text,record) => this.renderInput(text,record,'age'),
            },
            {
                title:'operation',
                dataIndex:'operation',
                render:(text,record)=>{
                    const editable = this.isEditing(record);
                    return (<div>
                        {
                            editable ? (
                                <span>
                                    <a onClick={()=>this.handleSave(record)}>save</a>
                                    <Divider type="vertical" />
                                    <Popconfirm title="Sure to cancel?" onConfirm={() => this.handleDelete(record)}>
                                        <a>delete</a>
                                    </Popconfirm>
                                </span>
                            ) : (
                                <span>
                                    <a onClick={() => this.handleEdit(record)}>edit</a>
                                </span>
                            )
                        }
                    </div>)

                }
            }
        ];
        return (<div>
            <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                Add a row
            </Button>
            <Table
                columns={columns}
                dataSource={this.state.data}
                rowKey={(record)=>record.key}
            />
        </div>)
    }
}
//组件中注入:
export default Form.create()(EditableTable);
