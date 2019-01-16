<template>
  <div class="signup-container" style="background-color: #141a48;margin: 0px;overflow: hidden;">
    <div id="canvascontainer" ref="can"></div>

    <div class="inputarea">
      <Input v-model="username" placeholder="Username"></Input>
      <Input v-model="email" placeholder="Email"></Input>
      <Input type="password" v-model="password" placeholder="Pw" @on-enter="Submit"></Input>
    </div>
  </div>
</template>
<script>
import { isWscnEmail } from "utils/validate";
import axios from '@/axios'

export default {
  name: "login",
  computed: {
    isemailaddress: function() {
      return /[\w]+(\.[\w]+)*@[\w]+(\.[\w])+/.test(this.email);
    }
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (false) {
          callback(new Error("请输入正确的合法邮箱"));
          this.$Message.error("请输入正确的合法邮箱");
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
          this.$Message.error("密码不能小于5位");

      } else {
        callback();
      }
    };
    return {
      loginForm: {
        email: "admin@admin",
        password: ""
      },
      loginRules: {
        email: [{ required: true, trigger: "blur", validator: validateEmail }],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      showDialog: false,
      username: "",
      password: "",
      email: ""
    };
  },
  mounted() {
    container = document.createElement("div");
    this.$refs.can.appendChild(container);

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 1000;

    scene = new THREE.Scene();

    particles = new Array();

    var PI2 = Math.PI * 2;
    var material = new THREE.ParticleCanvasMaterial({
      color: 0x0078de,
      program: function(context) {
        context.beginPath();
        context.arc(0, 0, 1, 0, PI2, true);
        context.fill();
      }
    });

    var i = 0;

    for (var ix = 0; ix < AMOUNTX; ix++) {
      for (var iy = 0; iy < AMOUNTY; iy++) {
        particle = particles[i++] = new THREE.Particle(material);
        particle.position.x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        particle.position.z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        scene.add(particle);
      }
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener("mousemove", onDocumentMouseMove, false);
    //

    window.addEventListener("resize", onWindowResize, false);

    animate();
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("LoginByEmail", this.loginForm)
            .then(() => {
              this.$Message.success("登录成功");

              this.loading = false;
              this.$router.push({ path: "/" });
            })
            .catch(err => {
              console.log(typeof err);
              this.$Message.error(err.toString());
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    Submit: function() {
      if (this.isemailaddress) {
        axios
          .post("/signup", {
            username: this.username,
            password: this.password,
            email: this.email,
            permission:1
          })
          .then(response => {
            if (response.data.ok) {
              this.$Notice.open({
                title: "Notification",
                desc: "Signup Success"
              });
              this.$router.push('/login');
            } else {
              this.$Notice.open({
                title: "Notification",
                desc: "Username or Password has been used"
              });
            }
          });
      } else {
        console.log("not email");
          this.$Message.error("请输入正确的合法邮箱");

      }
    }
  }
};

var SEPARATION = 100,
  AMOUNTX = 50,
  AMOUNTY = 50;

var container;
var camera, scene, renderer;

var particles,
  particle,
  count = 0;

var mouseX = 0,
  mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// animate();

function init() {}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {
  if (event.touches.length === 1) {
    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length === 1) {
    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  var i = 0;

  for (var ix = 0; ix < AMOUNTX; ix++) {
    for (var iy = 0; iy < AMOUNTY; iy++) {
      particle = particles[i++];
      particle.position.y =
        Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
      particle.scale.x = particle.scale.y =
        (Math.sin((ix + count) * 0.3) + 1) * 2 +
        (Math.sin((iy + count) * 0.5) + 1) * 2;
    }
  }

  renderer.render(scene, camera);

  count += 0.1;
}
</script>


<style>
.signup-container a {
  color: #0078de;
}

.signup-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  font-size: 0;
  white-space: nowrap;
  overflow: auto;
}

.signup-container:after {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
#canvascontainer {
  position: absolute;
  top: 0px;
}
.wz-input-group-prepend {
  background-color: #141a48;
  border: 1px solid #2d8cf0;
  border-right: none;
  color: #2d8cf0;
}

.inputarea {
  display: inline-block;
  vertical-align: middle;
  text-align: left;
  font-size: 14px;
  white-space: normal;
}
.inputarea a {
  color: #0078de;
}
</style>

<style rel="stylesheet/scss" lang="scss">
.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 5px;
}
.signup-container {
  height: 100vh;
  background-color: #2d3a4b;

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 1px solid #2d8cf0;
    -webkit-appearance: none;
    border-radius: 3px;
    padding: 12px 5px 12px 15px;
    color: #eeeeee;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
  }

  .title {
    font-size: 26px;
    font-weight: 400;
    color: #eeeeee;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }

  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .forget-pwd {
    color: #fff;
  }
}
</style>


