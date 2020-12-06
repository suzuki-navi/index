
// javascript array list slice sublist
const subarr = arr.slice(2, 4);
// 0, 1, 2, 3, 4, 5 => 2, 3

// javascript max array list math
// https://qiita.com/ndj/items/82e9c5a4518fe16e539f
const max = Math.max(a, b, c);
const max = Math.max.apply(null, arr);

// javascript vuejs component computed methods template
Vue.component("mytag", {
  data: function () { return {
    name: "aaa",
  }},
  computed: {
  },
  methods: {
    mymethod: function () {
    },
  },
  template: "<p>Hello, {{ name }}</p>",
});

// javascript vuejs app el new
new Vue({
  el: "#app",
});

// javascript json tojson tostring
JSON.stringify(obj)

// javascript base64 btoa encode
const encodedStr = window.btoa(byteArr);
const encodedStr = byteArr.toString("base64");

// javascript foreach array list
// 配列の値でループ
for (const el of arr) {
    ...;
}
// 配列のキーまたはインデックスでループ
for (const key in arr) {
    ...;
}

