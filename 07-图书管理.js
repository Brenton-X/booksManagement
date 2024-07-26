/**
 * 1. 渲染图书列表
 * 1.1 获取数据
 * 1.2 渲染数据
*/
const creator = 'Brenton'
function getBookList() {
  // 获取数据
  axios({
    url: 'http://hmajax.itheima.net/api/books',
    params: {
      creator
    }
  }).then(result => {
    const bookList = result.data.data
    console.log(bookList)
    // 渲染数据
    const htmlStr = bookList.map((item, index) => {
      return `<tr>
          <td>${index + 1}</td>
          <td>${item.bookname}</td>
          <td>${item.author}</td>
          <td>${item.publisher}</td>
          <td data-id=${item.id}>
            <span class="del">删除</span>
            <span class="edit">编辑</span>
          </td>
        </tr>`
    }).join('')
    document.querySelector('.list').innerHTML = htmlStr
    console.log(htmlStr);
  })
}

// 网页加载运行，获取并渲染一次
getBookList()

/**
 * 2. 新增图书
 * 2.1 新增弹框 显示和隐藏
 * 2.2 收集表单数据并提交到服务器保存
 * 2.3 刷新图书列表
 */

// 创建弹框对象
const addModalDom = document.querySelector('.add-modal')
const addModal = new bootstrap.Modal(addModalDom)
// 保存按钮（点击隐藏）
document.querySelector('.add-btn').addEventListener('click', () => {
  // 收集表单数据并提交
  const addForm = document.querySelector('.add-form')
  const bookObj = serialize(addForm, { hash: true, empty: true })
  console.log(bookObj);

  // 提交到服务器
  axios({
    url: 'http://hmajax.itheima.net/api/books',
    method: 'post',
    data: {
      ...bookObj,
      creator
    }
  }).then(result => {
    console.log(result);
    // 添加后重新渲染
    getBookList()

    // 重置表单
    addForm.reset()
    // 隐藏
    addModal.hide()
  })
})

/**
 * 3 删除图书
 * 3.1 绑定点击事件
 * 3.2 调用删除接口
 * 3.3 刷新列表
 */

// 事件委托
document.querySelector('.list').addEventListener('click', e => {
  if (e.target.classList.contains('del')) {
    // 获取图书id
    const theId = e.target.parentNode.dataset.id
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`,
      method: 'delete'
    }).then(() => {
      // 刷新列表
      getBookList()
    })
  }
})

/**
 * 4 编辑图书
 * 4.1 编辑弹框（显示和隐藏）
 * 4.2 获取当前编辑图书数据
 * 4.3 提交保存修改，并刷新列表
 */

// 编辑弹框
const editDom = document.querySelector('.edit-modal')
const editModal = new bootstrap.Modal(editDom)

// 编辑元素
document.querySelector('.list').addEventListener('click', e => {
  if (e.target.classList.contains('edit')) {
    // 获取当前图书数据
    const theId = e.target.parentNode.dataset.id
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`
    }).then((result) => {
      const bookObj = result.data.data
      // document.querySelector('.edit-form .bookname').value = bookObj.bookname
      // document.querySelector('.edit-form .author').value = bookObj.author
      // document.querySelector('.edit-form .publisher').value = bookObj.publisher
      const keys = Object.keys(bookObj)
      keys.forEach(key => {
        document.querySelector(`.edit-form .${key}`).value = bookObj[key]
      })
    })

    editModal.show()
  }
})

// 修改按钮 点击隐藏
document.querySelector('.edit-btn').addEventListener('click', () => {
  // 提交保存修改，刷新列表
  const editForm = document.querySelector('.edit-form')
  const { id, bookname, author, publisher } = serialize(editForm, { hash: true, empty: true })
  axios({
    url: `http://hmajax.itheima.net/api/books/${id}`,
    method: 'put',
    data: {
      bookname,
      author,
      publisher,
      creator
    }
  }).then(() => {
    getBookList()
  })

  editModal.hide()
})

