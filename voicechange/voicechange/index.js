const vm = new Vue({
  el: "#app",
  data() {
    return {
      files: [],
      upload_message: "拖拽或者点击选择文件",
      file_message: "文件路径相关",
      file_path: "",
      progress: 0,
      horiProg: 0,
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
      uplPathClassObj: {
        hiddenList: false,
      },
      retuPathStyleObj: {
        display: "none",
      },
      Popclass1Obj: {
        showus: false,
      },
      Popclass2Obj: {
        showus: false,
      },

      RunpopClassObj: {
        showus: false,
      },
      prohibited: false,
      prohibited1: false,
      isClicked: false,
      isFileUpload: false,
      isSeparatecpl: false,
      isTransfercpl: false,
    };
  },
  methods: {
    closeFilePopup() {
      this.Popclass1Obj.showus = false;
    },
    openFilePopup() {
      this.Popclass1Obj.showus = true;
    },
    closeSchedulePopup() {
      this.Popclass2Obj.showus = false;
    },
    openSchedulePopup() {
      this.Popclass2Obj.showus = true;
    },

    remove(index) {
      this.files.splice(index, 1);
    },
    creatOneNum() {
      let ram = Math.random() * new Date();
      return ram.toString(16).replace(".", "");
    },
    getfiles(argfiles) {
      let files = Array.from(argfiles);
      if (files.length === 0) {
        alert("请先选择要上传的文件");
        return;
      }

      console.log(this.files);
      this.uplPathClassObj.hiddenList = false;
      this.retuPathStyleObj.display = "none";
      //重构files数据结构，生成每个元素的唯一标识
      this.files = files.map((file) => {
        return {
          file,
          filename: file.name,
          id: this.creatOneNum(),
        };
      });
      console.log(this.files);
      this.progress = 20;
    },
    dropfiles(e) {
      // let files = Array.from(e.dataTransfer.files);
      this.getfiles(e.dataTransfer.files);
    },
    select(e) {
      // console.log(e.target.files);
      this.getfiles(e.target.files);
    },
    upload() {
      //已经上传过的文件会因为文件名带有路径而上传失败，后台没有对应的目录
      if (this.files.length === 0) {
        alert("请先选择文件再上传");
        return;
      }
      if (this.isClicked) return;
      this.isClicked = true;
      // loop 上传多文件到服务器
      //先拿到所有的list
      let thumbArr = Array.from(document.querySelectorAll(".progress-thumb"));
      console.log(thumbArr);
      tempFiles = this.files.map((item) => {
        let fm = new FormData(),
          curThumb = thumbArr.find(
            (div) => div.getAttribute("name") === item.id
          );
        // console.log(curThumb);
        fm.append("sing", item.file);
        fm.append("name", item.filename);
        return instance
          .post("/sing", fm, {
            onUploadProgress: (e) => {
              curThumb.style.width = `${Math.round(
                (e.loaded * 100) / e.total
              )}%`;
            },
          })
          .then((data) => {
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
          this.progress = 40;
          // alert("success");
          this.upload_message = "上传成功";
          this.uploadIconstyleObj.display = "none";
          this.upSecIconstyleObj.display = "inline-block";
          this.upBtnStyleObj.display = "none";
          this.isFileUpload = true;
          setTimeout(() => {
            this.upload_message = "请选择文件";
            this.uploadIconstyleObj.display = "inline-block";
            this.upSecIconstyleObj.display = "none";
          }, 4000);
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
      this.RunpopClassObj.showus = true;
      this.prohibited1 = true; //禁用文件表单
      //  /separate
      try {
        data = await instance.get("/separate");
        if (+data.code === 0) {
          this.progress = 60;
          alert("人声分离完成");
          this.isSeparatecpl = true;
          return;
        }
        throw data.codeText;
      } catch (err) {
        alert("人声分离失败");
      } finally {
        this.RunpopClassObj.showus = false;
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
      this.RunpopClassObj.showus = true;
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
            this.progress = 80;
            this.isTransfercpl = true;
            this.uplPathClassObj.hiddenList = true;
            this.file_message = "文件已保存至：";
            this.retuPathStyleObj.display = "block";
            this.file_path = data.servicePath;
            return;
          }
        })
        .catch((reason) => {
          // console.log(reason.message);
          alert(`转换失败,可能的原因是${reason.message}`);
        })
        .finally(() => {
          this.RunpopClassObj.showus = false;
        });
    },
    combine_audio() {
      if (this.isTransfercpl === false) {
        alert("请先转换完成后再点击混音");
        return;
      }
      this.RunpopClassObj.showus = true;
      instance
        .get("/combine_audio")
        .then((data) => {
          if (+data.code === 0) {
            this.progress = 100;
            this.uplPathClassObj.hiddenList = true;
            alert("混音完成,您可以继续上传歌曲文件转换歌声");
            this.file_message = "文件已保存至：";
            this.retuPathStyleObj.display = "block";
            this.file_path = data.servicePath;
            return;
          }
        })
        .catch((reason) => {
          // console.log(reason.message);
          alert(`混音失败,可能的原因是${reason.message},请重复开始`);
          this.progress = 0;
        })
        .finally(() => {
          //取消表单禁用 + 状态归原
          this.RunpopClassObj.showus = false;
          this.prohibited = false;
          this.prohibited1 = false;
          this.isFileUpload = false;
          this.isSeparatecpl = false;
          this.isTransfercpl = false;
          setTimeout(() => {
            this.progress = 0;
          }, 1500);
        });
    },
  },
  computed: {
    totalSize() {
      let total = 0;
      this.files.map((item) => {
        total += item.file.size;
      });
      return Math.floor(total / 1024 / 1024);
    },
    totalCount() {
      return this.files.length;
    },
  },
});
