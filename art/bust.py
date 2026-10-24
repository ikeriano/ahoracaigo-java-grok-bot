from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
from scipy import ndimage
im=Image.open('/workspace/javagames_ref/arturo/01M5MVRT4M5EJYZDB3C6HAGRM9.jpg').convert('RGB').crop((330,30,770,470))
a=np.array(im).astype(int); r,g,b=a[...,0],a[...,1],a[...,2]
Y=np.arange(a.shape[0])[:,None]
bg=((b>r+30)&(b>80))|((b>=r)&(r+g+b>480)&(Y<200))
fg=~bg; fg[:20]=False; fg=ndimage.binary_opening(fg,iterations=3)
lab,n=ndimage.label(fg); sz=ndimage.sum(fg,lab,range(1,n+1)); fg=lab==(1+np.argmax(sz))
fg=ndimage.binary_closing(fg,iterations=4); fg=ndimage.binary_fill_holes(fg)
c=a.astype(float); c[...,0]*=1.0; c[...,1]*=1.04; c[...,2]*=0.78
img=Image.fromarray(np.clip(c,0,255).astype('uint8'))
img=ImageEnhance.Color(img).enhance(1.1); img=ImageEnhance.Contrast(img).enhance(1.2)
W=H=160
sm=img.resize((W,H),Image.LANCZOS).filter(ImageFilter.SMOOTH_MORE)
m=np.array(Image.fromarray((fg*255).astype('uint8')).resize((W,H),Image.LANCZOS))>128
q=np.array(sm.quantize(40,method=Image.MEDIANCUT,dither=Image.Dither.NONE).convert('RGB')).astype(int)

y0=int(H*0.60)
for y in range(y0,H):
    for x in range(W//2):
        if not m[y,x]:
            mx=W-1-x
            if m[y,mx]: m[y,x]=True; q[y,x]=q[y,mx]
edge=m & ~ndimage.binary_erosion(m); q[edge]=(q[edge]*0.3).astype(int)
lum=q.mean(2); e=np.hypot(ndimage.sobel(lum,0),ndimage.sobel(lum,1))>280; q[e&m]=(q[e&m]*0.65).astype(int)
out=np.dstack([np.clip(q,0,255),m*255]).astype('uint8')
Image.fromarray(out,'RGBA').save('host_bust.png')
chk=Image.new('RGBA',(W,H),(30,80,200,255)); chk.alpha_composite(Image.fromarray(out,'RGBA'))
chk.resize((W*3,H*3),Image.NEAREST).save('chk_bust7.png')
