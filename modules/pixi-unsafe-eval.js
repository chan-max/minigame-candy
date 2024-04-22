/*!
 * @pixi/unsafe-eval - v7.4.2
 * Compiled Wed, 20 Mar 2024 19:55:28 UTC
 *
 * @pixi/unsafe-eval is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
this.PIXI = this.PIXI || {};
var _pixi_unsafe_eval = function(exports, core) {
  "use strict";
  const GLSL_TO_SINGLE_SETTERS = {
    vec3(gl, location, cv, v) {
      (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) && (cv[0] = v[0], cv[1] = v[1], cv[2] = v[2], gl.uniform3f(location, v[0], v[1], v[2]));
    },
    int(gl, location, _cv, value) {
      gl.uniform1i(location, value);
    },
    ivec2(gl, location, _cv, value) {
      gl.uniform2i(location, value[0], value[1]);
    },
    ivec3(gl, location, _cv, value) {
      gl.uniform3i(location, value[0], value[1], value[2]);
    },
    ivec4(gl, location, _cv, value) {
      gl.uniform4i(location, value[0], value[1], value[2], value[3]);
    },
    uint(gl, location, _cv, value) {
      gl.uniform1ui(location, value);
    },
    uvec2(gl, location, _cv, value) {
      gl.uniform2ui(location, value[0], value[1]);
    },
    uvec3(gl, location, _cv, value) {
      gl.uniform3ui(location, value[0], value[1], value[2]);
    },
    uvec4(gl, location, _cv, value) {
      gl.uniform4ui(location, value[0], value[1], value[2], value[3]);
    },
    bvec2(gl, location, _cv, value) {
      gl.uniform2i(location, value[0], value[1]);
    },
    bvec3(gl, location, _cv, value) {
      gl.uniform3i(location, value[0], value[1], value[2]);
    },
    bvec4(gl, location, _cv, value) {
      gl.uniform4i(location, value[0], value[1], value[2], value[3]);
    },
    mat2(gl, location, _cv, value) {
      gl.uniformMatrix2fv(location, !1, value);
    },
    mat4(gl, location, _cv, value) {
      gl.uniformMatrix4fv(location, !1, value);
    }
  }, GLSL_TO_ARRAY_SETTERS = {
    float(gl, location, _cv, value) {
      gl.uniform1fv(location, value);
    },
    vec2(gl, location, _cv, value) {
      gl.uniform2fv(location, value);
    },
    vec3(gl, location, _cv, value) {
      gl.uniform3fv(location, value);
    },
    vec4(gl, location, _cv, value) {
      gl.uniform4fv(location, value);
    },
    int(gl, location, _cv, value) {
      gl.uniform1iv(location, value);
    },
    ivec2(gl, location, _cv, value) {
      gl.uniform2iv(location, value);
    },
    ivec3(gl, location, _cv, value) {
      gl.uniform3iv(location, value);
    },
    ivec4(gl, location, _cv, value) {
      gl.uniform4iv(location, value);
    },
    uint(gl, location, _cv, value) {
      gl.uniform1uiv(location, value);
    },
    uvec2(gl, location, _cv, value) {
      gl.uniform2uiv(location, value);
    },
    uvec3(gl, location, _cv, value) {
      gl.uniform3uiv(location, value);
    },
    uvec4(gl, location, _cv, value) {
      gl.uniform4uiv(location, value);
    },
    bool(gl, location, _cv, value) {
      gl.uniform1iv(location, value);
    },
    bvec2(gl, location, _cv, value) {
      gl.uniform2iv(location, value);
    },
    bvec3(gl, location, _cv, value) {
      gl.uniform3iv(location, value);
    },
    bvec4(gl, location, _cv, value) {
      gl.uniform4iv(location, value);
    },
    sampler2D(gl, location, _cv, value) {
      gl.uniform1iv(location, value);
    },
    samplerCube(gl, location, _cv, value) {
      gl.uniform1iv(location, value);
    },
    sampler2DArray(gl, location, _cv, value) {
      gl.uniform1iv(location, value);
    }
  };
  function syncUniforms(group, uniformData, ud, uv, renderer) {
    let textureCount = 0, v = null, cv = null;
    const gl = renderer.gl;
    for (const i in group.uniforms) {
      const data = uniformData[i], uvi = uv[i], udi = ud[i], gu = group.uniforms[i];
      if (!data) {
        gu.group === !0 && renderer.shader.syncUniformGroup(uvi);
        continue;
      }
      data.type === "float" && data.size === 1 && !data.isArray ? uvi !== udi.value && (udi.value = uvi, gl.uniform1f(udi.location, uvi)) : data.type === "bool" && data.size === 1 && !data.isArray ? uvi !== udi.value && (udi.value = uvi, gl.uniform1i(udi.location, Number(uvi))) : (data.type === "sampler2D" || data.type === "samplerCube" || data.type === "sampler2DArray") && data.size === 1 && !data.isArray ? (renderer.texture.bind(uvi, textureCount), udi.value !== textureCount && (udi.value = textureCount, gl.uniform1i(udi.location, textureCount)), textureCount++) : data.type === "mat3" && data.size === 1 && !data.isArray ? gu.a !== void 0 ? gl.uniformMatrix3fv(udi.location, !1, uvi.toArray(!0)) : gl.uniformMatrix3fv(udi.location, !1, uvi) : data.type === "vec2" && data.size === 1 && !data.isArray ? gu.x !== void 0 ? (cv = udi.value, v = uvi, (cv[0] !== v.x || cv[1] !== v.y) && (cv[0] = v.x, cv[1] = v.y, gl.uniform2f(udi.location, v.x, v.y))) : (cv = udi.value, v = uvi, (cv[0] !== v[0] || cv[1] !== v[1]) && (cv[0] = v[0], cv[1] = v[1], gl.uniform2f(udi.location, v[0], v[1]))) : data.type === "vec4" && data.size === 1 && !data.isArray ? gu.width !== void 0 ? (cv = udi.value, v = uvi, (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) && (cv[0] = v.x, cv[1] = v.y, cv[2] = v.width, cv[3] = v.height, gl.uniform4f(udi.location, v.x, v.y, v.width, v.height))) : (cv = udi.value, v = uvi, (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) && (cv[0] = v[0], cv[1] = v[1], cv[2] = v[2], cv[3] = v[3], gl.uniform4f(udi.location, v[0], v[1], v[2], v[3]))) : (data.size === 1 && !data.isArray ? GLSL_TO_SINGLE_SETTERS : GLSL_TO_ARRAY_SETTERS)[data.type].call(null, gl, udi.location, udi.value, uvi);
    }
  }
  function install(_core) {
    core.utils.deprecation("7.1.0", "install() has been deprecated, @pixi/unsafe-eval is self-installed since 7.1.0");
  }
  function selfInstall() {
    Object.assign(
      core.ShaderSystem.prototype,
      {
        systemCheck() {
        },
        syncUniforms(group, glProgram) {
          const { shader, renderer } = this;
          syncUniforms(
            group,
            shader.program.uniformData,
            glProgram.uniformData,
            group.uniforms,
            renderer
          );
        }
      }
    );
  }
  return selfInstall(), exports.install = install, exports;
}({}, PIXI);
Object.assign(this.PIXI, _pixi_unsafe_eval);
//# sourceMappingURL=unsafe-eval.js.map