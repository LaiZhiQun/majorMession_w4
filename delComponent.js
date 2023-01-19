export default {
  props: ['tempProduct', 'getProductsList'],
  template: `#delProductModal`,
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2/',
      api_path: 'brad5566',
    }
  },
  mounted(){
    this.delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
  },
  methods: {
    delProduct() {
      axios({
        method: 'delete',
        url: `${this.url}api/${this.api_path}/admin/product/${this.tempProduct.id}`
      }).then(res => {
        alert(res.data.message)
        delProductModal.hide()
        this.getProductsList()
      })
      // .catch(err => {
      //   console.log(err.data);
      //   alert(err.data.message)
      // })
    },
  }
}