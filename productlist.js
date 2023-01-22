import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import pagination from './pagination.js'
import delComponent from './delComponent.js'

const url = 'https://vue3-course-api.hexschool.io/v2/'
const api_path = 'brad5566'
let productModal = {};
let delProductModal = {};

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false, // 確認是新增或編輯的判斷
      page: {},
    }
  },
  components: {
    pagination,
    delComponent
  },
  methods: {
    checkLogin() {
      axios({
        method: 'post',
        url: `${url}api/user/check`,
      }).then(res => {
        // 若為登入狀態，則顯示產品列表
        this.getProductsList()
      }).catch(err => {
        // 若登入失敗，則回到登入頁面
        alert(err.data.message)
        document.location.href = 'index.html';
      })
    },
    // 選擇打開 modal 視窗的種類 
    // 編輯時，將資料帶進 tempProduct，productModal 的 input 欄位與資料雙向綁定，即可看到原先資料
    openModal(isNew, item) {
      if (isNew === 'edit') {
        this.tempProduct = { ...item }
        this.isNew = false
        productModal.show()
      }
      // 為了顯示 title，需先將資料帶入 tempProduct
      else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }
      // 新增時，則清空 tempProduct
      else if (isNew === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      }
    },
    getProductsList(page = 1) { // 預設第一頁
      axios({
        method: 'get',
        url: `${url}api/${api_path}/admin/products/?page=${page}`,
      }).then(res => {
        this.products = res.data.products
        this.page = res.data.pagination
      }).catch(err => {
        alert(err.data.message)
      })
    },
    removeImage(key) {
      this.tempProduct.imagesUrl.splice(key, 1)
    },
    closeModal(state) {
      if (state === 'del') {
        delProductModal.hide()
      }
    }
  },
  mounted() {
    // 選取 產品 Modal
    productModal = new bootstrap.Modal(document.querySelector('#productModal'))
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    // this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal);
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.checkLogin()
  }
})

// 產品新增/編輯元件
app.component('product-modal', {
  props: ['tempProduct', 'isNew', 'getProductsList', 'removeImage'],
  template: `#product-modal-template`,
  methods: {
    // 更新資料，以 isNew 判斷是否為新產品
    updateProduct() {
      if (!this.isNew) {
        // 編輯資料 put
        axios({
          method: 'put',
          url: `${url}api/${api_path}/admin/product/${this.tempProduct.id}`,
          data: {
            data: this.tempProduct
          }
        }).then(res => {
          alert(res.data.message)
          productModal.hide()
          this.getProductsList()
        })
          .catch(err => {
            alert(err.data.message)
          })
      } else {
        // 新增資料 post
        axios({
          method: 'post',
          url: `${url}api/${api_path}/admin/product`,
          data: {
            data: this.tempProduct
          }
        }).then(res => {
          alert(res.data.message)
          productModal.hide()
          this.getProductsList()
        }).catch(err => {
          alert(err.data.message)
        })
      }
    },
    // 當編輯時，若該項目沒有主要圖片之外的圖片，會造成tempProduct.imagesUrl沒有陣列產生，push時會發生錯誤
    push() {
      if (Array.isArray(this.tempProduct.imagesUrl)) {
        this.tempProduct.imagesUrl.push('')
      } else if (!Array.isArray(this.tempProduct.imagesUrl)) {
        this.tempProduct.imagesUrl = []
        this.tempProduct.imagesUrl.push('')
      }
    },
  }
})

app.mount('#app')