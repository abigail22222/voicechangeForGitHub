const vm = new Vue({
  el: "#app",
  data() {
    return {
      file_path: "raw/example.wav",
      key: 0,
      singerid: "",
      speedup: 50,
      f0: "false",
      use_diff: "true",
      use_gpu: "true",
      completion: 85,
      classObj: {
        showus: false,
      },
      navclassObj: { active: false },
      prohibited: false,
      prohibited1: false,
      isFileUpload: false,
      isSeparatecpl: false,
      isTransfercpl: false,
    };
  },
  methods: {
    thisNav1() {
      this.navclassObj.active = true;
    },
    closePopup() {
      this.classObj.showus = false;
    },
    openPopup() {
      this.classObj.showus = true;
    },
    upload(e) {
      //   1.获取文件对象
      let file = e.target.files[0];
      //如果没有对象直接返回  测试者可能点击取消上传文件
      if (!file) {
        console.log("没获取到文件，给用户提示");
        alert("请先选择要上传的文件");
        return;
      }
      //    2.上传文件到服务器
      //  /sing
      let formData = new FormData();
      formData.append("sing", file);
      formData.append("name", file.name);
      console.log("成功拿到formData做请求体");
      instance
        .post("/sing", formData)
        .then((data) => {
          if (+data.code === 0) {
            alert("文件上传成功");
            console.log("文件上传成功");
            this.isFileUpload = true;
            this.file_path = "文件已上传至：" + data.servicePath;
            return;
          }
        })
        .catch((reason) => {
          console.log(reason.message);
          alert(`文件上传失败,可能的原因是${reason.message}`);
        });
    },
    separate() {
      if (this.isFileUpload === false) {
        alert("请先上传歌曲文件后再点击人声分离");
        return;
      }
      this.prohibited1 = true; //禁用文件表单
      //  /separate
      instance
        .get("/separate")
        .then((data) => {
          if (+data.code === 0) {
            alert("人声分离完成");
            console.log("人声分离完成");
            this.isSeparatecpl = true;
            return;
          }
        })
        .catch((reason) => {
          alert("人声分离失败");
        });
    },
    postForm(formData, paraName, value, url) {
      formData.append(paraName, value);
      console.log(`vue成功拿到${paraName},值为:${value}`);
      instance
        .post(url, formData)
        .then((data) => {
          if (+data.code === 0) {
            console.log(`后台成功获取${paraName}值`);
            return;
          }
        })
        .catch((reason) => {
          console.log(reason.message);
          alert(`获取${paraName}值失败,可能的原因是${reason.message}`);
        });
    },
    start_convert() {
      if (this.singerid === "") {
        alert("说话人id是必填项,请填写完成后再点击开始转换");
        return;
      } else if (this.isSeparatecpl === false) {
        alert("人声分离还未完成");
        return;
      }
      this.prohibited = true; //禁用表单
      //  /key
      let keyfd = new FormData();
      this.postForm(keyfd, "key", this.key, "/key");

      //  /id
      let idfd = new FormData();
      const id = this.singerid.toLowerCase(); //全转为小写
      this.postForm(idfd, "id", id, "/id");

      //  /speedup
      let speedupfd = new FormData();
      this.postForm(speedupfd, "speedup", this.speedup, "/speedup");

      //  /f0_adjust
      let ajustfd = new FormData();
      this.postForm(ajustfd, "f0", this.f0, "/f0_adjust");

      //  /use_GPU
      let use_gpufd = new FormData();
      this.postForm(use_gpufd, "GPU", this.use_gpu, "/use_GPU");

      //  /use_diff
      let use_difffd = new FormData();
      this.postForm(use_difffd, "diff", this.use_diff, "/use_diff");

      //  /start_convert
      instance
        .get("/start_convert")
        .then((data) => {
          if (+data.code === 0) {
            alert("转换完成");
            console.log("转换完成");
            this.isTransfercpl = true;
            this.file_path = "转换结果文件路径：" + data.servicePath;
            return;
          }
        })
        .catch((reason) => {
          console.log(reason.message);
          alert(`转换失败,可能的原因是${reason.message}`);
        });
    },
    combine_audio() {
      if (this.isTransfercpl === false) {
        alert("请先转换完成后再点击混音");
        return;
      }
      instance
        .get("/combine_audio")
        .then((data) => {
          if (+data.code === 0) {
            //取消表单禁用
            this.prohibited = false;
            this.prohibited1 = false;
            alert("混音完成,您可以继续上传歌曲文件转换歌声");
            console.log("混音完成,您可以继续上传歌曲文件转换歌声");
            this.file_path = "混音结果文件路径：" + data.servicePath;
            return;
          }
        })
        .catch((reason) => {
          console.log(reason.message);
          alert(`混音失败,可能的原因是${reason.message}`);
        });
    },
  },
});
