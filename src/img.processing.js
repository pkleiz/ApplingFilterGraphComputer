(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.ImageProcessing = {}));
}(this, (function (exports) { 'use strict';



    function ImageProcesser(img, kernel = null, xform = null, bhandler = 'icrop') {
        this.img = img.clone();
        this.width = img.shape[1];
        this.height = img.shape[0];
        this.kernel = kernel;
        this.xform = xform;
        this.bhandler = bhandler;
    }


    function convolucao(kernel, imagem, altura, largura, border){
        
        let sum = 0;


        //armazenando a img original
        let img2 = imagem.clone();

        //aplicando filtro no interior da imagem, ignorando bordas
        for (let i=1; i < altura-1; i++){
            for (let j=1;j < largura-1; j++){

                //varrer o kernel 3x3
                for (let k=-1; k < 2; k++){
                    for (let l=-1;l < 2; l++){

                        //aplicando os valores do kernel
                        //img2.get pega o pixel da imagem original
                        sum = sum + img2.get(i+k,j+l)*kernel[k+1][l+1];
                    }
                }

                //clapping
                sum = Math.min(Math.max(0, sum), 255);
                //salvando um pixel relativo ao kernel varrido
                imagem.set(i,j,Math.round(sum));
                sum = 0;
            }
        }


        //tratamento de bordas

        //sum2 será usado para diferenciar calculo de bordas opostas
        let sum2 = 0;
        sum = 0;

        //bordas laterais
        for (let i=1; i < altura; i++){

            //borda lateral esquerda
            for (let l=-1;l < 2; l++){
                sum = sum + img2.get(i+l,0)*kernel[l+1][0];
            }
            for (let k=0; k < 2; k++){
                for (let l=-1;l < 2; l++){
                    sum = sum + img2.get(i+l,k)*kernel[l+1][k+1];
                }
            }

            //borda lateral direita
            for (let l=-1;l < 2; l++){
                sum2 = sum2 + img2.get(i+l,largura)*kernel[l+1][2];
            }
            for (let k=-1; k < 1; k++){
                for (let l=-1;l < 2; l++){
                    sum2 = sum2 + img2.get(i+l,largura+k)*kernel[l+1][k+1];
                }
            }
            
            //caso extended
            if(border != 'icrop'){
                sum = Math.min(Math.max(0, sum), 255);
                sum2 = Math.min(Math.max(0, sum), 255);
                imagem.set(i,0,sum);
                imagem.set(i,largura,sum2)
            }

            //caso crop
            else{ 
                imagem.set(i,0,0);
                imagem.set(i,largura,0)
            }
            sum = 0;
            sum2 = 0;
        }

        //bordas superior e inferior
        for (let i=1; i < largura; i++){

            //borda superior
            for (let l=-1;l < 2; l++){
                sum = sum + img2.get(0,i+l)*kernel[0][l+1];
            }
            for (let k=0; k < 2; k++){
                for (let l=-1;l < 2; l++){
                    sum = sum + img2.get(k,i+l)*kernel[k+1][l+1];
                }
            }

            //borda inferior
            for (let l=-1;l < 2; l++){
                sum2 = sum2 + img2.get(altura,i+l)*kernel[2][l+1];
            }
            for (let k=-1; k < 1; k++){
                for (let l=-1;l < 2; l++){
                    sum2 = sum2 + img2.get(altura+k,i+l)*kernel[k+1][l+1];
                }
            }
            
            //aplicando resultados
            if(border != 'icrop'){
                sum = Math.min(Math.max(0, sum), 255);
                sum2 = Math.min(Math.max(0, sum), 255);
                imagem.set(0,i,sum);
                imagem.set(altura,i,sum2)
            }

            else{ 
                imagem.set(0,i,0);
                imagem.set(altura,i,0)
            }
            sum = 0;
            sum2 = 0;
        }


        //quina superior esquerda
        sum=0;
        
        for (let k=0; k < 2; k++){
            for (let l=0;l < 2; l++){
                sum = sum + img2.get(k,l)*kernel[k+1][l+1];
            }
        }

        for (let k=0; k<2; k++){
            sum = sum + img2.get(0,k)*kernel[0][k+1];
        }

        for (let k=0; k<2; k++){
            sum = sum + img2.get(k,0)*kernel[k+1][0];
        }

        sum = sum + img2.get(0,0)*kernel[1][1];



        if(border != 'icrop'){
            sum = Math.min(Math.max(0, sum), 255);
            imagem.set(0,0,sum);
        }

        else{ 
            imagem.set(0,0,0);
        }

        //quina superior direita
        sum=0;
        for (let k=0; k < 2; k++){
            for (let l=-1;l < 1; l++){
                sum = sum + img2.get(k,largura+l)*kernel[k+1][l+1];
            }
        }


        for (let k=-1; k<1; k++){
            sum = sum + img2.get(0,largura+k)*kernel[0][k+1];
        }

        for (let k=0; k<2; k++){
            sum = sum + img2.get(k,largura)*kernel[k+1][2];
        }

        sum = sum + img2.get(0,largura)*kernel[1][1];
        

        if(border != 'icrop'){
            sum = Math.min(Math.max(0, sum), 255);
            imagem.set(0,largura,sum);
        }

        else{ 
            imagem.set(0,largura,0);
        }

        //quina inferior esquerda
        sum=0;
        for (let k=-1; k < 0; k++){
            for (let l=0;l < 2; l++){
                sum = sum + img2.get(altura + k,l)*kernel[k+1][l+1];
            }
        }

        for (let k=0; k<2; k++){
            sum = sum + img2.get(altura,k)*kernel[2][k+1];
        }

        for (let k=-1; k<0; k++){
            sum = sum + img2.get(altura+k,0)*kernel[k+1][0];
        }

        sum = sum + img2.get(altura,0)*kernel[1][1];


        if(border != 'icrop'){
            sum = Math.min(Math.max(0, sum), 255);
            imagem.set(altura,0,sum);
        }

        else{ 
            imagem.set(altura,0,0);
        }

        //quina inferior direita
        sum=0;
        for (let k=-1; k < 0; k++){
            for (let l=-1;l < 1; l++){
                sum = sum + img2.get(altura+k,largura+l)*kernel[k+1][l+1];
            }
        }

        for (let k=-1; k<1; k++){
            sum = sum + img2.get(altura,largura+k)*kernel[2][k+1];
        }

        for (let k=-1; k<0; k++){
            sum = sum + img2.get(altura+k,largura)*kernel[k+1][2];
        }

        sum = sum + img2.get(altura,largura)*kernel[1][1];
        

        if(border != 'icrop'){
            sum = Math.min(Math.max(0, sum), 255);
            imagem.set(altura,largura,sum);
        }

        else{ 
            imagem.set(altura,largura,0);
        }   
 
    }

    Object.assign( ImageProcesser.prototype, {

        apply_kernel: function(border = 'icrop') {
            // Method to apply kernel over image (incomplete)
            // border: 'icrop' is for cropping image borders, 'extend' is for extending image border
            // You may create auxiliary functions/methods if you'd like

            if (this.kernel == "box") {
                var kernel = [
                    [1 / 9, 1 / 9, 1 / 9],
                    [1 / 9, 1 / 9, 1 / 9],
                    [1 / 9, 1 / 9, 1 / 9]
                ]

                convolucao(kernel,this.img, this.height-1, this.width-1, border)
            }

            if (this.kernel == "sobel"){
                var kernel1 = [
                    [-1 / 8, 0 , 1 / 8],
                    [-2 / 8, 0 , 2 / 8],
                    [-1 / 8, 0 , 1 / 8]
                ]
                var kernel2 = [
                    [1 / 8  ,2 / 8  ,1 / 8 ],
                    [0      ,0      ,0     ],
                    [-1 / 8 ,-2 / 8 ,-1 / 8]
                ]
                let img1 = this.img.clone();
                let img2 = this.img.clone();
                convolucao(kernel1,img1, this.height-1, this.width-1, border)
                convolucao(kernel2,img2, this.height-1, this.width-1, border)

                for (let i=0; i < this.height; i++){
                    for (let j=0;j < this.width; j++){
                        //this.img.set(i,j,img1.get(i,j))
                        this.img.set(i,j,Math.round(Math.sqrt( Math.pow(img1.get(i,j),2) + Math.pow(img2.get(i,j),2))));
                    }
                }
                
            }

            if (this.kernel == "laplace"){
                var kernel = [
                    [0     ,-1 / 4,      0],
                    [-1 / 4, 4 / 4, -1 / 4],
                    [0     ,-1 / 4,      0]
                ]

                convolucao(kernel,this.img, this.height-1, this.width-1, border)
            }
        },

        apply_xform: function()  {
            // Method to apply affine transform through inverse mapping (incomplete)
            // You may create auxiliary functions/methods if you'd like

            //salvando a img original
            let img2 = this.img.clone();


            //calculando inversa
            let det_xform =     
                    xform.get(0,0) * xform.get(1,1) * xform.get(2,2)
                +   xform.get(0,1) * xform.get(1,2) * xform.get(2,0)
                +   xform.get(0,2) * xform.get(1,0) * xform.get(2,1)
                -   xform.get(0,2) * xform.get(1,1) * xform.get(2,0)
                -   xform.get(0,1) * xform.get(1,0) * xform.get(2,2)
                -   xform.get(0,0) * xform.get(1,2) * xform.get(2,1)


            let inv_xform = 
            [
                [ xform.get(1,1) * xform.get(2,2) - xform.get(1,2) * xform.get(2,1), xform.get(0,2) * xform.get(2,1) - xform.get(0,1) * xform.get(2,2), xform.get(0,1) * xform.get(1,2) - xform.get(0,2) * xform.get(1,1) ],
                [ xform.get(1,2) * xform.get(2,0) - xform.get(1,0) * xform.get(2,2), xform.get(0,0) * xform.get(2,2) - xform.get(0,2) * xform.get(2,0), xform.get(0,2) * xform.get(1,0) - xform.get(0,0) * xform.get(1,2) ],
                [ xform.get(1,0) * xform.get(2,1) - xform.get(1,1) * xform.get(2,0), xform.get(0,1) * xform.get(2,0) - xform.get(0,0) * xform.get(2,1), xform.get(0,0) * xform.get(1,1) - xform.get(0,1) * xform.get(1,0) ]
            ]
            
                   

            for( let i = 0; i < 3; i++ ){
                for( let j = 0; j <3; j++ ){
                    inv_xform[i][j] *= 1/det_xform;
                }
            }

            //inversa da transformação 3x3
            //console.log(this.xform)

            let xform_i = nj.array([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);

            xform_i.set(0,0,inv_xform[0][0])
            xform_i.set(0,1,inv_xform[0][1])
            xform_i.set(0,2,inv_xform[0][2])

            xform_i.set(1,0,inv_xform[1][0])
            xform_i.set(1,1,inv_xform[1][1])
            xform_i.set(1,2,inv_xform[1][2])

            xform_i.set(2,0,inv_xform[2][0])
            xform_i.set(2,1,inv_xform[2][1])
            xform_i.set(2,2,inv_xform[2][2])
            

            //ponto [x,y,0]
            //valor generico para declaracao
            let ponto = nj.array([0, 5, 0]);
            let result = 255;


            //varrendo a imagem

            for (let i=0; i < this.height; i++){
                for (let j=0;j < this.width; j++){
                    
                    
                    ponto.set(0,i);
                    ponto.set(1,j);

                    //multiplica o ponto pela inversa da xform
                    //para inverse mapping
                    ponto = nj.dot(ponto,xform_i)

                    //if(i==50 && j==50 ){
                        //console.log(ponto);
                        //console.log(img2.get(ponto.get(0),ponto.get(1)))
                        //console.log(ponto.get(1))
                    //}
                    

                    //transforma o ponto encontrado em inteiro
                    //e pega a cor daquele 
                    
                    let A = ponto.get(0)-Math.floor(ponto.get(0))
                    let B = ponto.get(1)-Math.floor(ponto.get(1))



                    //img(x,y)=(1-A)*(1-B)*img(i,j)+A*(1-B)*img(i+1,j)+A*B*img(i+1,j+1)+(1-a)*img(i,j+1)


                    //interpolação bilinear
                    result = (1-A)*(1-B) * img2.get(Math.round(ponto.get(0)),Math.round(ponto.get(1))) 
                             + A*(1-B)* img2.get(Math.round(ponto.get(0) +1),Math.round(ponto.get(1)))
                             + A*B* img2.get(Math.round(ponto.get(0)) +1,Math.round(ponto.get(1) +1))
                             + (1-A)*img2.get(Math.round(ponto.get(0)),Math.round(ponto.get(1) +1))

                
                    if(i==27 && j==85 ){
                        console.log(img2.get(Math.round(ponto.get(0)),Math.round(ponto.get(1))))
                    }


                    //result = Math.round(img2.get(ponto.get(0,0),ponto.get(1,0)))

                    //seta o resultado na img a ser printada
                    this.img.set(i,j,result);


                }
            }
        },

        update: function() {
            // Method to process image and present results
            var start = new Date().valueOf();

            if(this.kernel != null) {
                this.apply_kernel(this.bhandler);
            }

            if(this.xform != null) {
                this.apply_xform();
            }

            // Loading HTML elements and saving
            var $transformed = document.getElementById('transformed');
            $transformed.width = this.width; 
            $transformed.height = this.height;
            nj.images.save(this.img, $transformed);
            var duration = new Date().valueOf() - start;
            document.getElementById('duration').textContent = '' + duration;
        }

    } )


    exports.ImageProcesser = ImageProcesser;
    
    
})));

