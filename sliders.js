class createSlider{
    constructor(containerId, headerText, min, max, initialValue, step, unit, handler){
        const container = document.getElementById(containerId);
        this.unit = unit;
        this.handler = handler;

        this.init_min = min;
        this.init_max = max;
        this.init_step = step;
        this.init_unit = unit;
        this.label_mult = false;


        // Slider Wrapper
        const sliderWrapper = document.createElement('div');
        container.appendChild(sliderWrapper);
    
        // Header
        this.header = document.createElement('h3');
        this.header.textContent = headerText;
        sliderWrapper.appendChild(this.header);
    
        // Slider
        this.slider = document.createElement('input');
        this.slider.type = 'range';
        this.slider.min = min;
        this.slider.max = max;
        this.slider.value = initialValue;
        this.slider.step = step;
        this.slider.style.width = '200px';
        sliderWrapper.appendChild(this.slider);
    
        // Value Indicator
        this.valueIndicator = document.createElement('span');
        this.valueIndicator.textContent = initialValue + this.unit;
        sliderWrapper.appendChild(this.valueIndicator);
    
        this.slider.value = initialValue;
    
        // Update Value Indicator on Slider Change
        this.slider.oninput = this.oninput;
    }

    set(val){
        this.slider.value = val;
        this.valueIndicator.textContent = `${val}${this.unit}`;
    }   

    hide(bool){
        this.slider.hidden = bool;
        this.valueIndicator.hidden = bool;
        this.header.hidden = bool;
    }

    get value(){
        return parseFloat(this.slider.value);
    }

    update_label(){
        let val;
        if(this.label_mult){
            console.log("mult");
            this.unit = ''
            val = Math.round(this.slider.value*100000)/100;
            this.valueIndicator.textContent = `${val}${this.unit}`;
        }
        else{
            this.unit = this.init_unit;
            val = Math.round(this.slider.value*1000)/1000;
            this.valueIndicator.textContent = `${val}${this.unit}`;
        }
    }

    oninput = () => {
        this.update_label();
        this.handler(this.header.textContent);
    }

    set_range(scale){
        this.slider.min = (this.init_min / scale)/1.005 + this.init_min*(1-1/1.005);
        this.slider.max = (this.init_max / scale)/1.005 + this.init_max*(1-1/1.005);
        this.slider.step = this.init_step / scale;
        if(scale > 100) this.label_mult = true;
        else this.label_mult = false;
        this.update_label();
    }
}


class createCheckbox{
    constructor(containerId, label, checkboxId, handler){
        // Find the container where the checkbox will be added
        const container = document.getElementById(containerId);

        this.header = document.createElement('h4');
        this.header.textContent = '';
        container.appendChild(this.header);

        // Create the checkbox input element
        this.checkbox = document.createElement('input');
        this.checkbox.type = 'checkbox';
        this.checkbox.id = checkboxId;

        // Create a label element for the checkbox
        this.checkboxLabel = document.createElement('label');
        this.checkboxLabel.htmlFor = checkboxId;
        this.checkboxLabel.textContent = label;

        this.checkbox.addEventListener('change', handler);

        // Append the checkbox and label to the container
        container.appendChild(this.checkbox);
        container.appendChild(this.checkboxLabel);
    }

    get checked(){
        return this.checkbox.checked;
    }

    set(val){
        this.checkbox.checked = val;
    }   

    hide(bool){
        this.checkbox.hidden = bool;
        this.header.hidden = bool;
        this.checkboxLabel.hidden = bool;
    }
}



function selectTab(event, tabId) {
    var tabButtons = document.querySelectorAll('.tab-button');
    
    // Remove the 'selected' class from all tab buttons
    tabButtons.forEach(function(button) {
        button.classList.remove('selected');
    });

    // Add the 'selected' class to the clicked button
    event.currentTarget.classList.add('selected');

    zoom_checkbox.set(false);

    if(tabId == "Tab1") { // running and sleeping
        MODE = 1;
        frame_speed_slider.set(0);
        obj_slider.set(0.5);
        obj_slider.hide(false);
        triangle_checkbox.hide(false);
        frame_speed_slider.hide(false);
    }

    else if(tabId == "Tab2") { // many cats
        MODE = 2;
        frame_speed_slider.set(0);
        frame_speed_slider.set_range(2);
        obj_slider.hide(true);
        triangle_checkbox.hide(true);
        frame_speed_slider.hide(false);
    }

    else if(tabId == "Tab3") { // arrows
        MODE = 3;
        frame_speed_slider.set(0);
        obj_slider.set(0);
        obj_slider.hide(false);
        frame_speed_slider.set(0);
        frame_speed_slider.hide(true);
        triangle_checkbox.hide(false);
    }

    console.log("Mode: ", MODE);
    
    update();
}
