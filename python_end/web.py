from flask import Flask, jsonify,request,make_response
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources=r'/*')
app.config['file'] = ''

@app.route('/')
def root_func():  
     print('访问了根目录')
     return 'Hello world!!!'



@app.route('/sing',methods=['POST','GET'])
def get_sing():
    if request.method=='POST':
        audio=request.files.get('sing')
        name=request.form.get('name')
        print('获得了歌曲')
        file = 'raw/'+name
        app.config['file']  = name
        audio.save(file)
        data = {
            "code": "0",
            "codeText": "success",
            "originalFilename":name,
            "servicePath":file
        }
        return jsonify(data)
    
    
@app.route('/separate')
def separate():
    print('人声分离')
    data = {
            "code": "0",
            "codeText": "success",
        }
    return jsonify(data)


@app.route('/start_convert')
def start_convert():
    print('转换歌曲')
    file = './result/'+app.config['file']
    data = {
            "code": "0",
            "codeText": "success",
            "servicePath":file
        }
    return jsonify(data)

@app.route('/combine_audio')
def combine_audio():
    print('混音')
    file = './result/'+'增加BGM_'+app.config['file']
    data = {
            "code": "0",
            "codeText": "success",
            "servicePath":file
        }
    return jsonify(data)


@app.route('/key',methods=['POST','GET'])
def key():
    if request.method=='POST':
        nm=request.form.get('key') #请求体格式是form-data
        print(f'获得了半音数:{nm}')     
        data = {
            "code": "0",
            "codeText": "success"
        }
        return jsonify(data)
    else:
        data = {
            "code": "1",
            "codeText": "failed,需要使用post请求"
        }
        return jsonify(data)#就算错误了，返回的值也得是json格式

@app.route('/id',methods=['POST','GET'])
def id():
    if request.method=='POST':
        nm=request.form.get('id')#请求体格式是form-data
        if nm == 'trump' :
            print('目标为trump')
            data = {
                "code": "0",
                "codeText": "success"
            }
            return jsonify(data)
        elif nm == 'justin':
            print('目标为justin')
            data = {
                "code": "0",
                "codeText": "success"
            }
            return jsonify(data)
        elif nm == 'adele':
            print('目标为aele')
            data = {
                "code": "0",
                "codeText": "success"
            }
            return jsonify(data)
        elif nm == 'taylor':
            print('目标为taylor')#名字写成adele了
            data = {
                "code": "0",
                "codeText": "success"
            }
            return jsonify(data)
        elif nm == 'tmz':
            print('目标为tmz')#名字写成atmz了
            data = {
                "code": "0",
                "codeText": "success"
            }
            return jsonify(data)
        else:
            data = {
                "code": "1",
                "codeText": "failed,没有没有该id"
            }
            print(f'没有该id:{nm}')
            return jsonify(data)

@app.route('/speedup',methods=['POST','GET'])
def speedup():
    if request.method=='POST':
        nm=request.form.get('speedup')#请求体格式是form-data
        print(f'获得了加速倍数:{nm}')     
        data = {
                "code": "0",
                "codeText": "success"
            }
        return jsonify(data)
    else:
        data = {
            "code": "1",
            "codeText": "failed,需要使用post请求"
        }
        return jsonify(data)

@app.route('/f0_adjust',methods=['POST','GET'])
def f0_adjust():
    if request.method=='POST':
        nm=request.form.get('f0')#请求体格式是form-data
        if nm == 'true':
            print('使用基频校准')  
        else:
            print('不使用基频校准')

        data = {
                "code": "0",
                "codeText": "success"
            }
        return jsonify(data)
    else:
        data = {
            "code": "1",
            "codeText": "failed,需要使用post请求"
        }
        return jsonify(data)

#此处忘记加上@符号
@app.route('/use_GPU',methods=['POST','GET'])
def use_GPU():
    if request.method=='POST':
        nm=request.form.get('GPU')#请求体格式是form-data
        if nm == 'true':
            print('使用GPU')  
        else:
            print('不使用GPU')     

        data = {
                "code": "0",
                "codeText": "success"
            }
        return jsonify(data)
    else:
        data = {
            "code": "1",
            "codeText": "failed,需要使用post请求"
        }
        return jsonify(data)
    
#此处忘记加上@符号
@app.route('/use_diff',methods=['POST','GET'])
def use_diff():
    if request.method=='POST':
        nm=request.form.get('diff')#请求体格式是form-data
        if nm == 'true':
            print('使用扩散模型')  
        else:
            print('不使用扩散模型')   

        data = {
                "code": "0",
                "codeText": "success"
            }
        return jsonify(data)
    else:
        data = {
            "code": "1",
            "codeText": "failed,需要使用post请求"
        }
        return jsonify(data)

# 运行代码
if __name__ == '__main__':
    #运用debug可以在浏览器上看到报错的输出
    #设置端口为5000
    app.run(port=5000,host="127.0.0.1",debug=True)














