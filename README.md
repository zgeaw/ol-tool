# el-select 下拉滚动加载

```sh
npm i scroll-el-select
yarn add scroll-el-select
```

## 使用

以下示例全部支持下拉加载

### 示例：远程搜索

```vue
<template>
  <select-scroll
    :value="form.id"
    :length="list.length"
    :pageCur="params.pageNum"
    :pageSize="params.pageSize"
    :loading="loading"
    :total="total"
    @handle="handle"
  >
    <el-option
      v-for="item in list"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
    </el-option>
  </select-scroll>
</template>

<script>
import SelectScroll from "scroll-el-select";
import _ from "lodash";
export default {
  components: {
    SelectScroll: SelectScroll,
  },
  data() {
    return {
      form: {
        id: "",
      },
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      loading: false, // 可以没有，不会有loading效果
      total: 0,
      list: [],
    };
  },
  methods: {
    handle(event) {
      switch (event.type) {
        case "search":
          this.list = [];
          this.params.pageNum = 1;
          this.getList();
          break;
        case "getList":
          this.params.pageNum = this.params.pageNum + 1;
          this.getList();
          break;
        case "change":
          this.form.id = event.data;
          break;
        default:
        // 支持事件：["focus", "visible-change", "remove-tag", "clear", "blur"];
      }
    },
    getList: _.debounce(function () {
      this.loading = true;
      fetch(`/list?${qs.stringify(this.params)}`)
        .then((res) => res.json())
        .then((res) => {
          if (res && Array.isArray(res.rows)) {
            this.total = res.total;
            this.list.push(...res.rows);
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          let pageNum = this.params.pageNum - 1;
          this.params.pageNum = pageNum < 1 ? 1 : pageNum;
        })
        .finally(() => {
          this.loading = false;
        });
    }),
  },
};
</script>
```

## API SelectScroll
## props
属性|说明|类型|默认值
:-------: | :-------  |  :-------:  |  :-------:
value |  默认选中的数据, 6位数字或者地区中文数组  |String, Number, Array |  -
disabledScroll |  禁用下拉加载  |Boolean |  false
disabled |  设置为禁止选择状态  |Boolean |  false
placeholder |  占位符  |String |  请选择
clearable |  是否可以清空选项  |Boolean |  true
filterable |  是否可搜索  |Boolean |  true
remote |  是否为远程搜索  |Boolean |  false
total |  数据总条数  |Number |  0
length |  当前已加载的数据条数  |Number |  0
pageCur |  当前页码  |Number |  1
pageSize |  每页显示的数据条数  |Number |  10
loading |  是否显示加载动画  |Boolean |  false
multiple |  是否允许多选  |Boolean |  false
size |  输入框尺寸  |String |  -
collapseTags |  多选时是否将选中值按文字的形式展示  |Boolean |  false
multipleLimit |  多选时用户最多可以选择的项目数，为 0 则不限制  |Number |  0
name |  select input 的 name 属性  |String |  0
autocomplete |  select input 的 autocomplete 属性  |String |  off
noMatchText |  搜索条件无匹配时显示的文字，也可以使用slot="empty"设置  |String |  无匹配数据
noDataText |  选项为空时显示的文字，也可以使用slot="empty"设置  |String |  无数据
popperClass |  Select 下拉框的类名  |String |  -
reserveKeyword |  多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词  |Boolean |  false
defaultFirstOption |  在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用  |Boolean |  false
automaticDropdown |  对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单  |Boolean |  false
popperAppendToBody |  是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false  |Boolean |  true

## events
事件名|说明|返回值|返回值参数说明
:-------: | :-------  |  :-------:  |  :-------:
handle |  操作事件  |Objece{ type, data } | 详见下表

## handle回调type
事件名|说明
:-------: | :-------:
search |  搜索事件
getList |  分页事件
change |  选中值发生变化时触发
focus |  当 input 获得焦点时触发
visible-change |  下拉框出现/隐藏时触发
remove-tag |  多选模式下移除tag时触发
clear |  可清空的单选模式下用户点击清空按钮时触发
blur |  当 input 失去焦点时触发

## 环境

### 1.0.0

```json
{
  "dependencies": {
    "element-ui": "^2.15.12",
    "lodash": "^4.17.21",
    "vue": "^2.7.7"
  }
}
```
