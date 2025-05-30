import './styles/style.styl'

require([
    'dojo-dstore/RequestMemory',
    'dgrid/OnDemandGrid'
], function (RequestMemory, OnDemandGrid) {
    
    // Check if value is long, so probably we need to truncate it
    const valueLengthChecker = (object, value, cellElement) => {
        if (value.length > 18) {
            cellElement.setAttribute("data-expandable", "true");
            cellElement.classList.add('cell--expandable');
        }

        return document.createTextNode(value);
    }

    // Event handler for expand/collapse on button click
    const expandCollapseEvent = (node) => {
        const collapsedClass = 'inner-wrapper--collapsed';
        const expandedClass = 'inner-wrapper--expanded';
        const parentNode = node.parentNode;
        const collapsibleList = parentNode.querySelectorAll(".cell--value");
        const collapsibleButtons = parentNode.querySelectorAll(".btn--expand-collapse");

        const isExpanded = Array.from(collapsibleList).some(el =>
            el.classList.contains(expandedClass)
        );

        collapsibleList.forEach(el => {
            el.classList.toggle(expandedClass, !isExpanded);
            el.classList.toggle(collapsedClass, isExpanded);
        });

        collapsibleButtons.forEach(el => {
            el.classList.toggle('btn--expanded', !isExpanded);
        });
        
    }

    // Builder for expand/collapse button
    const expandButtonBuilder = (expandEvent) => {
        const buttonExpandCollapse = document.createElement('button');
        
        buttonExpandCollapse.addEventListener('click', expandEvent.bind(this));
        buttonExpandCollapse.className = 'btn btn--expand-collapse';

        return buttonExpandCollapse;
    }
    
    // Builder for value wrapper
    const valueWrapperBuilder = (value = '', valueClass = 'cell--value') => {
        const valueWrapper = document.createElement('div');
        
        valueWrapper.className = `${valueClass} inner-wrapper--collapsed`;
        valueWrapper.textContent = value;
        
        return valueWrapper;
    }

    // Grid columns
    const gridColumns = {
        id: 'ID',
        name: {
            label: 'Name',
            renderCell: (...args) => valueLengthChecker(...args),
        },
        email: {
            label: 'Email',
            renderCell: (...args) => valueLengthChecker(...args),
        },
        profession: {
            label: 'Profession',
            renderCell: (...args) => valueLengthChecker(...args),
        },
        hobbies: {
            label: 'Hobbies',
            renderCell: (...args) => valueLengthChecker(...args),
        },
        description: {
            label: 'Description',
            renderCell: (...args) => valueLengthChecker(...args),
        },
        age: 'Age',
        location: 'Location',
        interests: { 
            label: 'Interests',
            renderCell: (...args) => valueLengthChecker(...args),
        },
    };
    

    var grid = new OnDemandGrid({
        collection: new RequestMemory({ target: 'src/data.json' }),
        columns: gridColumns,
    }, 'grid1');

    grid.startup();


    grid.on("dgrid-refresh-complete", function () {
        const cells = grid.domNode.querySelectorAll(".dgrid-cell[data-expandable='true']");
        cells.forEach(cell => {
            if (cell.querySelector(".expand-btn")) return;

            const valueWrapper = valueWrapperBuilder(cell.textContent);
            const expandButton = expandButtonBuilder(expandCollapseEvent.bind(this, cell));
            cell.innerHTML = "";
            cell.appendChild(valueWrapper);
            cell.appendChild(expandButton)
        });
    });
});
