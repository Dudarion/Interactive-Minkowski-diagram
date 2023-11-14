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
        // if(scale == 1) this.set(0);
        this.update_label();
    }
}


function createHeader(containerId, text){
    const container = document.getElementById(containerId);
    header = document.createElement('h2');
    header.textContent = text;
    container.appendChild(this.header);
    return header;
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


class createSwitch{
    constructor(containerId, header_text, text_1, text_2, handler){
        const container = document.getElementById(containerId);

        this.handler = handler;
        this.text_1 = text_1;
        this.text_2 = text_2;

        this.header = document.createElement('h4');
        this.header.textContent = header_text;
    
        // Create a wrapper for the label and switch for flex alignment
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center'; // Align items vertically
    
        // Create the text label
        this.label = document.createElement('label');
        this.label.textContent = text_1;
        this.label.style.marginLeft = '10px'; // Add some spacing
    
        // Create the switch (same as before)
        this.switchLabel = document.createElement('label');
        this.switchLabel.className = 'switch';
        this.switchInput = document.createElement('input');
        this.switchInput.type = 'checkbox';
        this.switchSlider = document.createElement('span');
        this.switchSlider.className = 'slider round';
    
        // Construct the elements
        this.switchLabel.appendChild(this.switchInput);
        this.switchLabel.appendChild(this.switchSlider);
        
        wrapper.appendChild(this.switchLabel);
        wrapper.appendChild(this.label);
    
        // Append the wrapper to the container
        if(header_text) container.appendChild(this.header);
        container.appendChild(wrapper);

        this.switchInput.addEventListener('change', this.onChangeHandler);

        this.hide(true);
    }

    get checked(){
        return this.switchInput.checked;
    }

    set(val){
        this.switchInput.checked = val;
    }   

    onChangeHandler = () =>  {
        if(this.text_2 != false){
            let checked = this.switchInput.checked;
            if(checked) this.label.textContent = this.text_2;
            else this.label.textContent = this.text_1;
        }
        this.handler();
    }

    hide(bool){
        this.switchInput.hidden = bool;
        this.header.hidden = bool;
        this.label.hidden = bool;
        this.switchLabel.hidden = bool;
        this.switchSlider.hidden = bool;
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
    triangle_checkbox.set(false);
    globalShift = false; 
    lightcone = true;
    clocks_checkbox.set(false);
    scale_slider.set(1);
    frame_speed_slider.hide(false);
    frame_speed_slider.set(0);
    length_switcher.hide(true);
    clocks_checkbox.hide(false);

    if(tabId == "Tab1") { // running and sleeping
        MODE = 1;
        mode_header.textContent = "Coordinate transform";
        obj_slider.set(0.5);
        obj_slider.hide(false);
        triangle_checkbox.hide(false);
    }

    if(tabId == "Tab2") { // Twins paradox
        MODE = 2;
        mode_header.textContent = "Twins paradox";
        obj_slider.set(0.72);
        obj_slider.hide(false);
        globalShift = true; 
        zoom_checkbox.hide(true);
        triangle_checkbox.hide(true);
        clocks_checkbox.set(true);
    }

    else if(tabId == "Tab3") { // many cats
        MODE = 3;
        mode_header.textContent = "Relativity of simultaneity";
        // frame_speed_slider.set_range(2);
        obj_slider.hide(true);
        triangle_checkbox.hide(true);
    }

    else if(tabId == "Tab4") { // arrows
        MODE = 4;
        mode_header.textContent = "Length contraction";
        lightcone = false;
        obj_slider.set(0);
        obj_slider.hide(false);
        frame_speed_slider.set(0);
        frame_speed_slider.hide(true);
        triangle_checkbox.hide(false);
        length_switcher.hide(false);
        clocks_checkbox.hide(true);
        clocks_checkbox.set(true);
    }

    else if(tabId == "Tab5") { // galaxy
        MODE = 5;
        mode_header.textContent = "Fast travel";
        lightcone = false;
        obj_slider.set(0);
        obj_slider.hide(true);
        frame_speed_slider.set(0);
        triangle_checkbox.hide(false);
        clocks_checkbox.set(true);
    }

    console.log("Mode: ", MODE);
    
    update();
}
