layui.use(["table", "layer", "form"], function () {
  let table = layui.table;
  let layer = layui.layer;
  let form = layui.form;
  let editId; // 编辑的id
  // 添加按钮点击事件  打开添加弹窗
  $("#addBtn").click(function (params) {
    layer.open({
      type: 1,
      title: "添加学生",
      skin: "layui-layer-molv",
      area: ["500px"],
      // closeBtn: 1,
      anim: 1,
      content: $("#addModal"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
    });
    $("#reset").click();
  });
  // 监听表单提交事件 表单验证成功后触发该函数 增添弹窗
  form.on("submit(addSubmit)", function (data) {
    let formValue = form.val("example");
    // console.log(formValue, 'formValue')
    $.ajax({
      type: "post", // 请求方式
      url: "/addStudent", // 请求的url
      data: formValue,
      dataType: "json", // s数据类型
      //请求成功后的回调函数
      success: function (data) {
        // 修改成功后关闭弹窗
        layer.closeAll();
        // 添加成功后清除input搜索值
        $("#keyWords").val("");
        layer.open({
          type: 0,
          title: "提示",
          content: data.msg,
        });
        setTimeout(() => {
          layer.closeAll("dialog");
        }, 1500);
        // 刷新表格 请求一次学生列表接口。并且刷新了dom
        table.reload("studentsList", {
          // 搜索可以通过where传值
          where: {
            keyWords: $("#keyWords").val(),
          },
          page: {
            curr: 1, //重新从第 1 页开始
          },
        });
      },
    });
    return false;
  });
  // 初始化渲染表格
  table.render({
    elem: "#studentsList",
    url: "/getStudentList",
    method: "post",
    limit: 5,
    toolbar: "#toolbarDemo", //开启头部工具栏，并为其绑定左侧模板
    defaultToolbar: [
      "filter",
      "exports",
      "print",
      {
        //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
        title: "提示",
        layEvent: "LAYTABLE_TIPS",
        icon: "layui-icon-tips",
      },
    ],
    title: "用户数据表",
    cols: [
      [
        { type: "checkbox", fixed: "left" },
        {
          field: "id",
          title: "ID",
          width: 80,
          fixed: "left",
          unresize: true,
          sort: true,
        },
        { field: "username", title: "用户名", edit: "text" },
        { field: "addSex", title: "性别", edit: "text", sort: true },
        {
          field: "city",
          title: "城市",
          templet: function (res) {
            let span = `<span class='text-center'>没有数据：'/'</span>`;
            return res.area ? res.area : span;
          },
        },
        { field: "score", title: "分数", sort: true },
        { field: "age", title: "年龄", width: 120 },
        { fixed: "right", title: "操作", toolbar: "#editHtml", width: 115 },
      ],
    ],
    page: true,
  });
  // 监听表格行事件
  table.on("tool(studentsListLay)", function (obj) {
    let data = obj.data;
    // console.log(data,'222222')
    if (obj.event === "edit") {
      editId = obj.data.id; // 编辑id
      // 打开编辑弹窗
      layer.open({
        type: 1,
        title: "编辑学生",
        skin: "layui-layer-molv",
        area: ["500px"],
        closeBtn: 1,
        anim: 1,
        content: $("#editModal"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
      });
      // 给编辑表单赋值
      form.val("editExample", data);
    } else if (obj.event === "del") {
      layer.confirm("真的删除行?", function (index) {
        // 点击确定会执行function逻辑
        $.ajax({
          type: "post", // 请求方式
          url: "/delStudent", // 请求的url
          data: { id: data.id },
          dataType: "json", // s数据类型
          //请求成功后的回调函数
          success: function (data) {
            // 修改成功后关闭弹窗
            layer.closeAll();
            layer.open({
              type: 0,
              title: "提示",
              content: data.msg,
            });
            setTimeout(() => {
              layer.closeAll("dialog");
            }, 1500);
            $("#keyWords").val("");
            // 添加成功后清除input搜索值
            // 刷新表格 请求一次学生列表接口。并且刷新了dom
            table.reload("studentsList", {
              // 搜索可以通过where传值
              where: {
                keyWords: "",
              },
              page: {
                curr: 1, //重新从第 1 页开始
              },
            });
          },
        });
      });
    }
  });
  // 编辑弹窗提交事件
  form.on("submit(editSubmit)", function (data) {
    let formValue = form.val("editExample");
    formValue.id = editId;
    // console.log(formValue,'表单取值')
    $.ajax({
      type: "post", // 请求方式
      url: "/editStudent", // 请求的url
      data: formValue,
      dataType: "json", // s数据类型
      //请求成功后的回调函数
      success: function (data) {
        // 修改成功后关闭弹窗
        layer.closeAll();
        layer.open({
          type: 0,
          title: "提示",
          content: data.msg,
        });
        setTimeout(() => {
          layer.closeAll("dialog");
        }, 1500);
        // 添加成功后清除input搜索值
        // 刷新表格 请求一次学生列表接口。并且刷新了dom
        table.reload("studentsList", {
          // 搜索可以通过where传值
          where: {
            keyWords: $("#keyWords").val(),
          },
        });
      },
    });
    return false;
  });
  // 点击搜索按钮
  $("#searchBtn").click(function (params) {
    // 刷新表格 请求一次学生列表接口。并且刷新了dom
    table.reload("studentsList", {
      // 搜索可以通过where传值lay
      where: {
        keyWords: $("#keyWords").val(),
      },
    });
  });
  $("body").on("click", "#close", function () {
    layer.closeAll();
  });
});
