const vm = new Vue({
  el: "#app",
  data() {
    return {
      files: [],
      upload_message: "点击选择文件",
      file_message: "文件路径相关",
      file_path: "raw/example.wav",
      progress: 0,
      key: 0,
      singerid: "",
      speedup: 50,
      f0: "false",
      use_diff: "true",
      use_gpu: "true",
      uploadIconstyleObj: {
        display: "inline - block",
      },
      upSecIconstyleObj: {
        display: "none",
      },
      upBtnStyleObj: {
        display: "block",
      },
      PopclassObj: {
        showus: false,
      },
      navclassObj: { active: false },
      prohibited: false,
      prohibited1: false,
      isClicked: false,
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
      this.PopclassObj.showus = false;
    },
    openPopup() {
      this.PopclassObj.showus = true;
    },
    remove(index) {
      this.files.splice(index, 1);
    },
    creatOneNum() {
      let ram = Math.random() * new Date();
      return ram.toString(16).replace(".", "");
    },
    select(e) {
      // let file = e.target.files[0];
      let files = Array.from(e.target.files);
      // console.log(files);
      if (files.length === 0) {
        alert("请先选择要上传的文件");
        return;
      }
      //重构files数据结构，生成每个元素的唯一标识
      this.files = files.map((file) => {
        return {
          file,
          filename: file.name,
          id: this.creatOneNum(),
        };
      });
      // console.log(this.files);

      // // loop 上传多文件到服务器
      // tempFiles = tempFiles.map((item) => {
      //   let fm = new FormData();
      //   fm.append("sing", item.file);
      //   fm.append("name", item.filename);
      //   return instance.post("/sing", fm).then((data) => {
      //     if (+data.code === 0) {
      //       this.file_message = "文件已上传到：";
      //       item.filename = data.servicePath;
      //       return;
      //     }
      //     return Promise.reject(reason);
      //   });
      // });

      // //所有文件都成功上传后
      // Promise.all(tempFiles)
      //   .then(() => {
      //     this.upload_message = "上传成功";
      //     this.uploadIconstyleObj.display = "none";
      //     this.upSecIconstyleObj.display = "inline-block";
      //     this.isFileUpload = true;
      //     return;
      //   })
      //   .catch((reason) => {
      //     alert(`文件上传失败,可能的原因是${reason.message}`);
      //   })
      //   .finally(() => {
      //     this.isClicked = false;
      //   });

      //    2.上传单个文件到服务器
      // let formData = new FormData();
      // formData.append("sing", file);
      // formData.append("name", file.name);
      // console.log("准备发送请求体");
      // instance
      //   .post("/sing", formData, {
      //     onUploadProgress: (e) => {
      //       this.progress = Math.round((e.loaded * 100) / e.total);
      //     },
      //   })
      //   .then((data) => {
      //     if (+data.code === 0) {
      //       this.upload_message = "上传成功";
      //       this.uploadIconstyleObj.display = "none";
      //       this.upSecIconstyleObj.display = "inline-block";
      //       this.isFileUpload = true;
      //       this.file_message = "文件已上传到：";
      //       this.file_path = data.servicePath;
      //       return;
      //     }
      //   })
      //   .catch((reason) => {
      //     // console.log(reason.message);
      //     alert(`文件上传失败,可能的原因是${reason.message}`);
      //   })
      //   .finally(() => {
      //     this.isClicked = false;
      //   });
    },
    upload() {
      if (this.files.length === 0) {
        alert("请先选择文件再上传");
        return;
      }
      if (this.isClicked) return;
      this.isClicked = true;
      // loop 上传多文件到服务器
      tempFiles = this.files.map((item) => {
        let fm = new FormData();
        fm.append("sing", item.file);
        fm.append("name", item.filename);
        return instance.post("/sing", fm).then((data) => {
          if (+data.code === 0) {
            this.file_message = "文件已上传到：";
            item.filename = data.servicePath;
            return;
          }
          return Promise.reject(reason);
        });
      });

      //所有文件都成功上传后
      Promise.all(tempFiles)
        .then(() => {
          this.upload_message = "上传成功";
          this.uploadIconstyleObj.display = "none";
          this.upSecIconstyleObj.display = "inline-block";
          this.upBtnStyleObj.display = "none";
          this.isFileUpload = true;
          return;
        })
        .catch((reason) => {
          alert(`文件上传失败,可能的原因是${reason.message}`);
        })
        .finally(() => {
          this.isClicked = false;
        });
    },
    async separate() {
      if (this.isFileUpload === false) {
        alert("请先上传歌曲文件后再点击人声分离");
        return;
      }
      this.prohibited1 = true; //禁用文件表单
      //  /separate
      try {
        data = await instance.get("/separate");
        if (+data.code === 0) {
          alert("人声分离完成");
          this.isSeparatecpl = true;
          return;
        }
        throw data.codeText;
      } catch (err) {
        alert("人声分离失败");
      }
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
          // console.log(reason.message);
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
            // console.log("转换完成");
            this.isTransfercpl = true;
            this.file_message = "文件已保存至：";
            this.file_path = data.servicePath;
            return;
          }
        })
        .catch((reason) => {
          // console.log(reason.message);
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
            // console.log("混音完成,您可以继续上传歌曲文件转换歌声");
            this.file_message = "文件已保存至：";
            this.file_path = data.servicePath;
            return;
          }
        })
        .catch((reason) => {
          // console.log(reason.message);
          alert(`混音失败,可能的原因是${reason.message}`);
        });
    },
  },
});
