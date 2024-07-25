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
          <td>
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