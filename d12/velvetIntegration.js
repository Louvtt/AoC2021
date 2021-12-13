class VelvetIntegration {
    constructor(points, sticks, ctx, dist) {
        this.points = points;
        this.sticks = sticks;

        this.ctx = ctx;
        this.center = {
            x: ctx.canvas.width  * .5,
            y: ctx.canvas.height * .5
        };

        this.dist = dist;

        this.f = .1;
    }
    
    updatePts() {
        for(let p_i = 0; p_i < this.points.length; ++p_i) {
            let p  = this.points[p_i],
                vx = p.x - p.oldX,
                vy = p.y - p.oldY;
            if(p.lock) continue;
        
            p.oldX = p.x;
            p.oldY = p.y;
            p.x   += vx;
            p.y   += vy;
    
            // apply force away from all other points
            // for(let p_i = 0; p_i < this.points.length; ++p_i) {
            //     let p2 = this.points[p_i];
            //     let x  = p2.x - p.x;
            //     let y  = p2.y - p.y;
            //     let l  = Math.sqrt(x*x + y*y);
            //     x /= l*l;
            //     y /= l*l;
            
            //     p.x += this.f * x;
            //     p.y += this.f * y;
            // }
            

            const gravity = .2;
            p.y += gravity;
    
            // No bounces just clamp it
            p.x = Math.min(this.ctx.canvas.width  , Math.max(0, p.x));
            p.y = Math.min(this.ctx.canvas.height , Math.max(0, p.y));
        }
    }

    renderPts() {
        for(let p_i = 0; p_i < this.points.length; ++p_i) {
            let p = this.points[p_i];
            this.ctx.fillStyle = "#0ff";
            if(p.text == "start") this.ctx.fillStyle = "#0f0";
            if(p.text == "end")   this.ctx.fillStyle = "#f00";
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 5, 0, 2*Math.PI);
            this.ctx.fill();
        }
    }

    updateSticks() {
        for(let s_i = 0; s_i < this.sticks.length; ++s_i) {
            let s    = this.sticks[s_i],
                dx   = s[1].x - s[0].x,
                dy   = s[1].y - s[0].y,
                d    = Math.sqrt(dx*dx + dy*dy),
                df   = this.dist - d,
                p    = df / d * .5,
                offX = dx * p,
                offY = dy * p;
            
            if(!s[0].lock) {
                s[0].x -= offX;
                s[0].y -= offY;
            }
            if(!s[1].lock) {
                s[1].x += offX;
                s[1].y += offY;
            }
        }
    }

    renderSticks() {
        for(let s_i = 0; s_i < this.sticks.length; ++s_i) {
            let s    = this.sticks[s_i];
            this.ctx.strokeStyle = "#fff";
            this.ctx.moveTo(s[0].x, s[0].y);
            this.ctx.lineTo(s[1].x, s[1].y);
            this.ctx.stroke();
        }
    }

    update() {
        this.updatePts();
        this.updateSticks();


        this.renderSticks();
        this.renderPts();
    }
}