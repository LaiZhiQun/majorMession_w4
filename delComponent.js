export default {
  props: ['tempProduct', 'getProductsList'],
  template: `#delProductModal`,
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2/',
      api_path: 'brad5566',
    }
  },
  methods: {
    delProduct() {
      axios({
        method: 'delete',
        url: `${this.url}api/${this.api_path}/admin/product/${this.tempProduct.id}`
      }).then(res => {
        alert(res.data.message)
        this.$emit('closeModal', 'del');
        this.getProductsList()
      })
      .catch(err => {
        console.log(err.data);
        alert(err.data.message)
      })
    },
  },
}