// localstrorage相当于我们的服务器
// 删除学生
Mock.mock("/delStudent", "post", function (options) {
  let data = stringToObj(options.body);
  data.id = parseInt(data.id);
  // 取之前学生数据
  const oldUser = JSON.parse(localStorage.getItem("studentsInfo"));
  const arr = [];
  for (let index = 0; index < oldUser.length; index++) {
    if (oldUser[index].id !== data.id) {
      arr.push(oldUser[index]);
    }
  }
  // 处理后的数据存到local中
  localStorage.setItem("studentsInfo", JSON.stringify(arr));
  return {
    code: 0,
    msg: "删除成功",
  };
});
// 修改学生
Mock.mock("/editStudent", "post", function (options) {
  let data = stringToObj(options.body);
  data.id = parseInt(data.id);
  //取之前存的所有学生数据
  let oldUser = JSON.parse(localStorage.getItem("studentsInfo"));
  for (let index = 0; index < oldUser.length; index++) {
    if (oldUser[index].id === data.id) {
      oldUser[index] = data;
    }
  }
  // 把修改后的数据存到local里面
  localStorage.setItem("studentsInfo", JSON.stringify(oldUser));
  //   console.log(oldUser, "oldUser");
  return {
    code: 0,
    msg: "编辑成功",
  };
});
// 添加学生
Mock.mock("/addStudent", "post", function (options) {
  console.log("添加");
  // 调用统一方法吧字符串处理成对象形式
  let data = stringToObj(options.body);
  // 先在本地储存里面取看是否有老学生数据
  let oldUser = JSON.parse(localStorage.getItem("studentsInfo")) || [];
  oldUser.unshift(data); // 把当前添加的信息和老学生数据合并
  // 给每条数据加上id
  for (let index = 0; index < oldUser.length; index++) {
    oldUser[index].id = index + 1;
  }
  // 把合并好后的数据存储到localStorage里面
  localStorage.setItem("studentsInfo", JSON.stringify(oldUser));
  return {
    code: 0,
    msg: "添加学生成功",
  };
});
// 获取学生列表
// 获取学生数据的接口
Mock.mock("/getStudentList", "post", function (options) {
  console.log(options);
  // 获取一下前端ajax传过来的key值
  let data = stringToObj(options.body);
  let keyValue = data.keyWords;
  console.log(data, "data");
  console.log(keyValue, "keyValue");
  // 所有学生数据
  let studentsData = JSON.parse(localStorage.getItem("studentsInfo")) || [];
  console.log(studentsData, "studentsData");
  let arr = []; // 保存搜索结果学生数据
  // 搜索学生 undefined null ''
  if (keyValue) {
    for (let index = 0; index < studentsData.length; index++) {
      if (studentsData[index].username.indexOf(keyValue) >= 0) {
        arr.push(studentsData[index]);
      }
    }
  }
  // 有搜索值时候 用过滤后的 arr 没有搜索值的时候用 studentsData
  let stuData = keyValue ? arr : studentsData;

  // 处理分页
  // 获取当前页 默认每页五条数据
  let page = parseInt(data.page);
  let limit = parseInt(data.limit);
  // 一共有多少页
  let allPage = Math.ceil(stuData.length / limit);
  const returnData = {
    code: 0,
    msg: "获取学生列表成功",
    count: stuData.length,
    data: stuData.splice((page - 1) * limit, limit),
  };
  return returnData;
});
// options中的body转成obj
function stringToObj(str) {
  let obj = {};
  let arr = str.split("&"); // 切割成数据
  for (let q = 0; q < arr.length; q++) {
    // arr[q] name=%25E9%2599%2588"
    let arr2 = arr[q].split("=");
    obj[arr2[0]] = decodeURI(arr2[1]);
  }
  return obj;
}
