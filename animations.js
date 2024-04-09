function exportVid(blob) {
    let src = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'myvid.mp4';
    a.href = src;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


class animations{
    constructor(containerId){
        const container = document.getElementById(containerId);

        this.running = false;
        this.interval = 25; // Duration in milliseconds between each increment
        this.interval_id = 0;
        this.frame_ind = 0;

        // Button Row
        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.justifyContent = 'space-around';
        buttonRow.style.width = '100%';
        buttonRow.style.marginTop = '10px'; 

        this.buttons = [];

        
        // Find the container where the checkbox will be added
        const container2 = document.getElementById('slider-container');
        const wait_button = document.createElement('button');
        wait_button.textContent = 'Wait'; 
        container2.appendChild(wait_button);
        wait_button.addEventListener('click', (event) => this.wait_animate());
    
        // Create and append buttons
        for (let i = 0; i < 5; i++) {
            const button = document.createElement('button');
            button.textContent = `Anim ${i + 1}`; 
            buttonRow.appendChild(button);
            button.addEventListener('click', (event) => this.animate(i));
            this.buttons.push(button);
        }
        this.buttons.push(wait_button);
        wait_button.hidden = true;
    
        container.appendChild(buttonRow);

        // this.rec_init();
    }


    rec_init(){
        this.chunks = []; 
        const stream = canvas.captureStream(); 
    
        // Specify the options for the MediaRecorder
        this.options = {
            mimeType: 'video/webm; codecs=vp9',
            videoBitsPerSecond: 10000000 // 10Mbps
        };
    
        // Check if the specified mimeType is supported
        if (!MediaRecorder.isTypeSupported(this.options.mimeType)) {
            console.error(`${this.options.mimeType} is not supported!`);
            return;
        }
    
        this.rec = new MediaRecorder(stream, this.options); 
    }

    rec_start(){
        this.rec.ondataavailable = e => this.chunks.push(e.data);

        // only when the recorder stops, we construct a complete Blob from all the chunks
        this.rec.onstop = e => exportVid(new Blob(this.chunks, {type: this.options.mimeType}));
    
        this.rec.start();
    }

    rec_stop(){
        this.rec.stop();
    }


    wait_animate(){
        const wait_time = wait_slider.value;
        console.log('wait', wait_time);
        if(this.running) return;
        this.running = true;
        this.frame_ind = 0;
        // let func2 = this.wait_animation.bind(this, wait_time);
        let func = () => {this.wait_animation(wait_time)};
        this.interval_id = setInterval(func, this.interval);
    }

    wait_animation(wait_time){
        this.frame_ind++;
        if(wait_shift < wait_time){
            wait_shift += 0.1;
            update();
        }
        else {
            saved_speed_origin = frameSpeed;
            saved_galaxy_p1 = curr_galaxy_p1.slice();
            saved_galaxy_p2 = curr_galaxy_p2.slice();
            saved_sleeping_p1 = curr_sleeping_p1.slice();
            saved_sleeping_p2 = curr_sleeping_p2.slice();
            wait_shift = 0;
            update();
            this.stop();
        }
    }
    

    animate(num){
        console.log("animate", num);
        if(this.running) return;
        this.running = true;
        let func;
        this.frame_ind = 0;
        cats_appear_cntr = 500;
    
        if(num == 0){
            if (MODE == 1){ // simple shift, low speed
                // this.rec_start();



                // scale_slider.set(101); // initial dummy anim with sleeping only
                // frame_speed_slider.set(0); 
                // obj_slider.set(0); 
                // cats_appear_cntr = 0;
                // func = () => {this.frame_animation_dummy()};


                // scale_slider.set(101); // initial dummy sleeping + running appearing
                // frame_speed_slider.set(0); 
                // obj_slider.set(0.001); 
                // cats_appear_cntr = 0;
                // func = () => {this.frame_animation_dummy()};

                scale_slider.set(100);
                frame_speed_slider.set(0); 
                obj_slider.set(0); 
                func = () => {this.frame_animation_0(0.001, 0.00001)};


                // clocks_checkbox.set(false);
                // triangle_checkbox.set(false);
                // scale_slider.set(1);
                // frame_speed_slider.set(0); 
                // obj_slider.set(0); 
                // func = () => {this.frame_animation3(0.6, 0.005)};
            }
            else if(MODE == 2){ // twins simple
                twins_animation_state = 0;
                globalShift = true; 
                scale_slider.set(1);
                frame_speed_slider.set(0); 
                obj_slider.set(0); 
                func = () => {this.object_animation(twin_speed, 0.006)};
            }
            else if (MODE == 3){ // many cats
                clocks_checkbox.set(true);
                scale_slider.set(1);
                frame_speed_slider.set(0); 
                func = () => {this.frame_animation(0.5, 0.006)};
            }
            else if (MODE == 4){ // arrow
                scale_slider.set(1);
                obj_slider.set(0); 
                func = () => {this.object_animation(0.5, 0.006)};
            }
            else if (MODE == 5){ // galaxy
                clocks_checkbox.set(true);
                scale_slider.set(1);
                frame_speed_slider.set(0); 
                func = () => {this.frame_animation(0.96, 0.006)};
            }
        }      

        else if(num == 1){
            if (MODE == 1){ // shift back and forth, low speed, without object
                light_checkbox.set(true);
                scale_slider.set(101);
                frame_speed_slider.set(0); 
                obj_slider.set(0); 
                func = () => {this.frame_animation2(0.0005, 0.00001)};
                // this.rec_start();
            }
            else if(MODE == 2){ // twins  long animation
                globalShift = false; 
                scale_slider.set(1);
                obj_slider.set(0); 
                twins_animation_state = 1;
                update();
                func = () => {this.twins_animation2(twin_speed, 0.006)};
            }
            else if (MODE == 3){ // many cats
                // scale_slider.set(1);
                // frame_speed_slider.set(0); 
                // func = () => {this.frame_animation2(0.5, 0.01)};

                scale_slider.set(101);
                frame_speed_slider.set(0); 
                func = () => {this.frame_animation2(0.0005, 0.00001)};
            }
        }   

        else if(num == 2){
            light_checkbox.set(false);
            if (MODE == 1){ // shift back and forth, low speed, with object
                scale_slider.set(100);
                frame_speed_slider.set(0); 
                obj_slider.set(0.001); 
                func = () => {this.frame_animation2(0.0005, 0.00001)};
            }
            else{
                frame_speed_slider.set(0); 
                func = () => {this.frame_animation2(0.5, 0.01)};
            }
        }   

        else if(num == 3){ // scale flip
            let currentValue = scale_slider.value;
            if(currentValue > 50) func = () => {this.scale_animation(1, 1)};
            else func = () => {this.scale_animation(100, 1)};
        }    

        else if(num == 4){ // frame speed changing with light cats
            light_checkbox.set(true);
            scale_slider.set(1);
            frame_speed_slider.set(0); 
            
            obj_slider.set(0); 
            func = () => {this.scale_animation2()};
        }

        this.interval_id = setInterval(func, this.interval);
    }

    frame_animation_dummy(){
        this.frame_ind++;
        if(this.frame_ind % 10 == 0){
            cats_appear_cntr++;
            update();
        }
        if(cats_appear_cntr > 20) this.stop();
    }

    scale_animation(target, step){
        if (this.move_slider(scale_slider, target, step));
        else this.stop();
    }

    object_animation(target, step){
        this.frame_ind++;
        if(this.frame_ind < 60);

        else if (this.move_slider(obj_slider, target, step));
        else this.stop();
    }

    twins_animation2(target, step){
        this.frame_ind++;

        if(this.frame_ind < 50);

        else if(this.frame_ind < 200){
            this.move_slider(obj_slider, target, step);
        }

        else if(this.frame_ind < 350){
            this.move_slider(frame_speed_slider, target, step);
        }

        else if(this.frame_ind < 490){
            if(twins_animation_state < 41) twins_animation_state += 1;
            update();
        }

        else if(this.frame_ind < 680){
            twins_animation_state = 42;
            this.move_slider(frame_speed_slider, -0.006, step);
        }

        else if(this.frame_ind < 700){
            twins_animation_state = 43;
            if(this.frame_ind == 680) obj_slider.set(0);
            update();
        }

        else if(this.move_slider(obj_slider, target, step));

        else this.stop();
    }

    scale_animation2(){
        this.frame_ind++;
        if(this.frame_ind < 30);

        else if(this.frame_ind < 110){
            this.move_slider(frame_speed_slider, 0.7, 0.01);
        }
        else if(this.frame_ind < 260){
            this.move_slider(frame_speed_slider, -0.7, 0.01);
        }
        else if(this.move_slider(frame_speed_slider, 0, 0.01));

        else {
            frame_speed_slider.set(0); 
            this.stop();
        }
    }

    frame_animation(target, step){
        this.frame_ind++;
        if(this.frame_ind < 50) return;
        else if (this.move_slider(frame_speed_slider, target, step));
        else this.stop();
    }

    frame_animation_0(target, step){
        this.frame_ind++;
        if(this.frame_ind < 50) obj_slider.set(0);
        else if (this.frame_ind == 50) obj_slider.set(0.001);
        else if (this.frame_ind < 150);
        else if (this.move_slider(frame_speed_slider, target, step));
        else this.stop();
    }

    frame_animation2(ampl, step){
        this.frame_ind++;
        if(this.frame_ind < 50) return;

        else if(this.frame_ind < 120){
            this.move_slider(frame_speed_slider, ampl, step);
        }

        else if(this.frame_ind < 240){
            this.move_slider(frame_speed_slider, -ampl, step);
        }

        else if(this.move_slider(frame_speed_slider, 0.00000, step));

        else this.stop();
    }

    frame_animation3(ampl, step){
        this.frame_ind++;
        if(this.frame_ind < 100){
            if(this.frame_ind == 50) {
                clocks_checkbox.set(true);
                update();
            }
        }

        else if(this.frame_ind < 300){
            if(this.frame_ind == 100) triangle_checkbox.set(true);
            this.move_slider(obj_slider, ampl, step);
        }

        else if(this.frame_ind < 450){
            this.move_slider(frame_speed_slider, ampl, step);
        }

        // else if(this.move_slider(frame_speed_slider, 0, step));

        else this.stop();
    }

    move_slider(slider, target, step){
        let currentValue = slider.value;
        if (Math.abs(currentValue - target) > step) {
            if(currentValue > target) currentValue -= step;
            else currentValue += step;
            slider.set(currentValue); 
            return true;
        } 
        else return false;
    }

    stop(){
        clearInterval(this.interval_id); // Stop the animation when max is reached
        this.running = false;
        console.log("STOPPED");
        update();
        // this.rec_stop();
    }
}




function twins_animation(state, target){
    
    if(state == 1){
        sleeping_points = drawSegmentWithCats(ctx, [0, 0], [0, 20], 21, frameSpeed, 'red', 'sleeping');
        if (clocks_checked) draw_clocks(ctx, sleeping_points, left=true, step=1, init=0);

        running_points = drawSegmentWithCats(ctx, [0, 0], [0, 4], 5, sum_speed_forward, 'blue', 'running', inverse=false, skip=0);
        if (clocks_checked) draw_clocks(ctx, running_points, left=false, step=1, init=0);
    }

    else if(state <= 41){

        let start_sleeping_p1 = Lorentz([0, 0], frameSpeed);
        let start_sleeping_p2 = Lorentz([0, 20], frameSpeed);
        start_sleeping_p1[1] -= (state-1) / 10;
        start_sleeping_p2[1] -= (state-1) / 10;
        sleeping_points = drawSegmentWithCats(ctx, start_sleeping_p1, start_sleeping_p2, 21, 0, 'red', 'sleeping', inverse=false, skip=-1);
        if (clocks_checked) draw_clocks(ctx, sleeping_points, left=true, step=1, init=0);


        let start_running_p1 = Lorentz([0, 0], sum_speed_forward);
        let start_running_p2 = Lorentz([0, 4], sum_speed_forward);
        start_running_p1[1] -= (state-1) / 10;
        start_running_p2[1] -= (state-1) / 10;
        running_points = drawSegmentWithCats(ctx, start_running_p1, start_running_p2, 5, 0, 'blue', 'running', inverse=false, skip=0);
        if (clocks_checked) draw_clocks(ctx, running_points, left=false, step=1, init=0);
    }

    else{

        let start_sleeping_p1 = Lorentz([0, 0], target);
        let start_sleeping_p2 = Lorentz([0, 20], target);
        start_sleeping_p1[1] -= 40 / 10;
        start_sleeping_p2[1] -= 40 / 10;
        start_sleeping_p1 = Lorentz(start_sleeping_p1, frameSpeed-target);
        start_sleeping_p2 = Lorentz(start_sleeping_p2, frameSpeed-target);

        sleeping_points = drawSegmentWithCats(ctx, start_sleeping_p1, start_sleeping_p2, 21, 0, 'red', 'sleeping', inverse=false, skip=-1);
        if (clocks_checked) draw_clocks(ctx, sleeping_points, left=true, step=1, init=0);


        let start_running_p1 = Lorentz([0, 0], 0);
        let start_running_p2 = Lorentz([0, 4], 0);
        start_running_p1[1] -= 40 / 10;
        start_running_p2[1] -= 40 / 10;
        start_running_p1 = Lorentz(start_running_p1, frameSpeed-target);
        start_running_p2 = Lorentz(start_running_p2, frameSpeed-target);

        running_points = drawSegmentWithCats(ctx, start_running_p1, start_running_p2, 5, 0, 'blue', 'running', inverse=false, skip=0,);
        if (clocks_checked) draw_clocks(ctx, running_points, left=false, step=1, init=0);

        if(state == 43){
            sum_speed_forward = vel_addition(frameSpeed, objectSpeed);
            running_points_2 = drawSegmentWithCats(ctx, [0, 0], [0, 4], 5, sum_speed_forward, 'blue', 'running', inverse=true, skip=0);
            if (clocks_checked) draw_clocks(ctx, running_points_2.slice(1), left=false, step=1, init=5);
        }
    }
}