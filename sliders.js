var sliders = {};
var sliderId = 0; // Unique identifier for each slider

function createSliderWithHeader(containerId, headerText, min, max, initialValue, step, unit, handler) {
    const container = document.getElementById(containerId);
    const uniqueId = `slider-${sliderId++}`;

    // Slider Wrapper
    const sliderWrapper = document.createElement('div');
    sliderWrapper.id = uniqueId;
    container.appendChild(sliderWrapper);

    // Header
    const header = document.createElement('h3');
    header.textContent = headerText;
    sliderWrapper.appendChild(header);

    // Slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.value = initialValue;
    slider.step = step;
    slider.style.width = '200px';
    sliderWrapper.appendChild(slider);

    // Value Indicator
    const valueIndicator = document.createElement('span');
    valueIndicator.textContent = initialValue + unit;
    sliderWrapper.appendChild(valueIndicator);

    sliders[uniqueId] = slider;

    // Update Value Indicator on Slider Change
    slider.oninput = function() {
        valueIndicator.textContent = `${this.value}${unit}`;
        handler();
    };
    

    // // Remove Button
    // const removeButton = document.createElement('button');
    // removeButton.textContent = 'Remove';
    // removeButton.onclick = function() {
    //     removeSlider(uniqueId);
    // };
    // sliderWrapper.appendChild(removeButton);
    return uniqueId;
}

function removeSlider(sliderId) {
    const sliderToRemove = document.getElementById(sliderId);
    if (sliderToRemove) {
        sliderToRemove.remove();
    }
}