/**
 * 
 * based on 
 * @author yoichi kobayashi | http://www.tplh.net
 * 
*/

import {
    PlaneBufferGeometry,
    Mesh,
    RawShaderMaterial,
    DoubleSide
} from "./three.module.js";

var Butterfly = function (i, texture, size) {
    this.uniforms = {
        index: {
            type: 'f',
            value: i
        },
        time: {
            type: 'f',
            value: 0
        },
        size: {
            type: 'f',
            value: size
        },
        texture: {
            type: 't',
            value: texture
        }        
    }
    this.physicsRenderer = null;
    this.obj = function (size) {
        var geometry = new PlaneBufferGeometry(size, size/2, 24, 12);
        var mesh = new Mesh(
            geometry,
            new RawShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: `attribute vec3 position;
                    attribute vec2 uv;

                    uniform mat4 modelViewMatrix;
                    uniform mat4 projectionMatrix;
                    uniform float index;
                    uniform float time;
                    uniform float size;

                    varying vec3 vPosition;
                    varying vec2 vUv;

                    void main() {
                      float flapTime = radians(sin(time * 6.0 - length(position.xy) / size * 2.6 + index * 2.0) * 45.0 + 30.0);
                      float hovering = cos(time * 2.0 + index * 3.0) * size / 16.0;
                      vec3 updatePosition = vec3(
                        cos(flapTime) * position.x,
                        position.y + hovering,
                        sin(flapTime) * abs(position.x) + hovering
                      );

                      vec4 mvPosition = modelViewMatrix * vec4(updatePosition, 1.0);

                      vPosition = position;
                      vUv = uv;

                      gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `precision highp float;
                    
                    Uniform Float Index;
                    Uniform Float Time;
                    Uniform Float Size;
                    Uniform Sampler2d Texture;
                    
                    Varying Vec3 Vposition;
                    Varying Vec2 Vuv;
                    
                    //
                    // Description : Array And Textureless Glsl 2d/3d/4d Simplex
                    //               Noise Functions.
                    //      Author : Ian Mcewan, Ashima Arts.
                    //  Maintainer : Ijm
                    //     Lastmod : 20110822 (Ijm)
                    //     License : Copyright (C) 2011 Ashima Arts. All Rights Reserved.
                    //               Distributed Under The Mit License. See License File.
                    //               Https://Github.Com/Ashima/Webgl-Noise
                    //
                    
                    Vec3 Mod289(Vec3 X) {
                      Return X - Floor(X * (1.0 / 289.0)) * 289.0;
                    }
                    
                    Vec4 Mod289(Vec4 X) {
                      Return X - Floor(X * (1.0 / 289.0)) * 289.0;
                    }
                    
                    Vec4 Permute(Vec4 X) {
                         Return Mod289(((X*34.0)+1.0)*X);
                    }
                    
                    Vec4 Taylorinvsqrt(Vec4 R)
                    {
                      Return 1.79284291400159 - 0.85373472095314 * R;
                    }
                    
                    Float Snoise3(Vec3 V)
                      {
                      Const Vec2  C = Vec2(1.0/6.0, 1.0/3.0) ;
                      Const Vec4  D = Vec4(0.0, 0.5, 1.0, 2.0);
                    
                    // First Corner
                      Vec3 I  = Floor(V + Dot(V, C.Yyy) );
                      Vec3 X0 =   V - I + Dot(I, C.Xxx) ;
                    
                    // Other Corners
                      Vec3 G = Step(X0.Yzx, X0.Xyz);
                      Vec3 L = 1.0 - G;
                      Vec3 I1 = Min( G.Xyz, L.Zxy );
                      Vec3 I2 = Max( G.Xyz, L.Zxy );
                    
                      //   X0 = X0 - 0.0 + 0.0 * C.Xxx;
                      //   X1 = X0 - I1  + 1.0 * C.Xxx;
                      //   X2 = X0 - I2  + 2.0 * C.Xxx;
                      //   X3 = X0 - 1.0 + 3.0 * C.Xxx;
                      Vec3 X1 = X0 - I1 + C.Xxx;
                      Vec3 X2 = X0 - I2 + C.Yyy; // 2.0*C.X = 1/3 = C.Y
                      Vec3 X3 = X0 - D.Yyy;      // -1.0+3.0*C.X = -0.5 = -D.Y
                    
                    // Permutations
                      I = Mod289(I);
                      Vec4 P = Permute( Permute( Permute(
                                 I.Z + Vec4(0.0, I1.Z, I2.Z, 1.0 ))
                               + I.Y + Vec4(0.0, I1.Y, I2.Y, 1.0 ))
                               + I.X + Vec4(0.0, I1.X, I2.X, 1.0 ));
                    
                    // Gradients: 7x7 Points Over A Square, Mapped Onto An Octahedron.
                    // The Ring Size 17*17 = 289 Is Close To A Multiple Of 49 (49*6 = 294)
                      Float N_ = 0.142857142857; // 1.0/7.0
                      Vec3  Ns = N_ * D.Wyz - D.Xzx;
                    
                      Vec4 J = P - 49.0 * Floor(P * Ns.Z * Ns.Z);  //  Mod(P,7*7)
                    
                      Vec4 X_ = Floor(J * Ns.Z);
                      Vec4 Y_ = Floor(J - 7.0 * X_ );    // Mod(J,N)
                    
                      Vec4 X = X_ *Ns.X + Ns.Yyyy;
                      Vec4 Y = Y_ *Ns.X + Ns.Yyyy;
                      Vec4 H = 1.0 - Abs(X) - Abs(Y);
                    
                      Vec4 B0 = Vec4( X.Xy, Y.Xy );
                      Vec4 B1 = Vec4( X.Zw, Y.Zw );
                    
                      //Vec4 S0 = Vec4(Lessthan(B0,0.0))*2.0 - 1.0;
                      //Vec4 S1 = Vec4(Lessthan(B1,0.0))*2.0 - 1.0;
                      Vec4 S0 = Floor(B0)*2.0 + 1.0;
                      Vec4 S1 = Floor(B1)*2.0 + 1.0;
                      Vec4 Sh = -Step(H, Vec4(0.0));
                    
                      Vec4 A0 = B0.Xzyw + S0.Xzyw*Sh.Xxyy ;
                      Vec4 A1 = B1.Xzyw + S1.Xzyw*Sh.Zzww ;
                    
                      Vec3 P0 = Vec3(A0.Xy,H.X);
                      Vec3 P1 = Vec3(A0.Zw,H.Y);
                      Vec3 P2 = Vec3(A1.Xy,H.Z);
                      Vec3 P3 = Vec3(A1.Zw,H.W);
                    
                    //Normalise Gradients
                      Vec4 Norm = Taylorinvsqrt(Vec4(Dot(P0,P0), Dot(P1,P1), Dot(P2, P2), Dot(P3,P3)));
                      P0 *= Norm.X;
                      P1 *= Norm.Y;
                      P2 *= Norm.Z;
                      P3 *= Norm.W;
                    
                    // Mix Final Noise Value
                      Vec4 M = Max(0.6 - Vec4(Dot(X0,X0), Dot(X1,X1), Dot(X2,X2), Dot(X3,X3)), 0.0);
                      M = M * M;
                      Return 42.0 * Dot( M*M, Vec4( Dot(P0,X0), Dot(P1,X1),
                                                    Dot(P2,X2), Dot(P3,X3) ) );
                      }
                    
                    Vec3 Converthsvtorgb(Vec3 C) {
                      Vec4 K = Vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                      Vec3 P = Abs(Fract(C.Xxx + K.Xyz) * 6.0 - K.Www);
                      Return C.Z * Mix(K.Xxx, Clamp(P - K.Xxx, 0.0, 1.0), C.Y);
                    }
                    
                    Void Main() {
                      Vec4 Texcolor = Texture2d(Texture, Vuv);
                    
                      Float Noise = Snoise3(Vposition / Vec3(Size * 0.25) + Vec3(0.0, 0.0, Time));
                      Vec3 Hsv = Vec3(1.0 + Noise * 0.2 + Index * 0.7, 0.4, 1.0);
                      Vec3 Rgb = Converthsvtorgb(Hsv);
                    
                      Gl_Fragcolor = Vec4(Rgb, 1.0) * Texcolor;
                   }
                `,
                depthWrite: false,
                side: DoubleSide,
                transparent: true
            })
        );
        mesh.rotation.set(-45 * Math.PI / 180, 0, 0);
        return mesh;
    }
    render(renderer, time) {
        this.uniforms.time.value += time;
        this.obj.position.z = (this.obj.position.z > -900) ? this.obj.position.z - 4 : 900;
    }
}

Butterfly.prototype = Object.create(Mesh.prototype);
Butterfly.prototype.constructor = Butterfly;

export { Butterfly };
