var currentlySelected = null;
const relatedToActiveCellClass = 'related-to-active-cell';

let hours = `00`;
let minutes = `00`;
let seconds = `00`;
let chronometerDisplay = $('#chronometer');
let chronometerCall;

function updateGameChronometer() {
    // Inspired from https://codepen.io/vanessametonini/pen/GMWEBv
    seconds++;

    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    if (seconds > 59) {
        seconds = '00';
        minutes++;

        if (minutes < 10) {
            minutes = '0' + minutes;
        }
    }

    if (minutes > 59) {
        minutes = '00';
        hours++;

        if (hours < 10) {
            hours = '0' + hours;
        }
    }

    chronometerDisplay.html(`${hours}:${minutes}:${seconds}`);
}

// Adds the chronometer
$(document).ready(function () {
    chronometerCall = setInterval(updateGameChronometer, 1000);
});

function isDeleteKey(key) {
    return key === 'Delete' || key === 'Backspace';
}

function isValidSudokuInput(value) {
    return value >= '1' && value <= '9';
}

function toggleRelatedCells() {
    selectedDomCell = currentlySelected[0];
    var selectedDomCellIndex = selectedDomCell.cellIndex;
    var selectedCellParentRow = selectedDomCell.parentElement;
    var parentRowIndex = selectedCellParentRow.rowIndex;

    /**
     * Toggle everything on the same row
     */
    $(selectedCellParentRow)
        .find('td')
        .each(function () {
            if (this.cellIndex != selectedDomCellIndex) {
                $(this).toggleClass(relatedToActiveCellClass);
            }
        });

    /**
     * Toggle everything on the same column and on the same subregion
     */
    $('#sudoku-board tr').each(function () {
        if (this.rowIndex == parentRowIndex) {
            return;
        }

        // This will access the same column
        $(this.cells[selectedDomCellIndex]).toggleClass(
            relatedToActiveCellClass
        );

        // This will access the cells at the same subregion
        var currentRowSubRegion = Math.floor(this.rowIndex / 3);
        var selectedCellRowSubRegion = Math.floor(parentRowIndex / 3);
        if (currentRowSubRegion == selectedCellRowSubRegion) {
            $(this)
                .find('td')
                .each(function () {
                    if (
                        this.cellIndex != selectedDomCellIndex &&
                        Math.floor(this.cellIndex / 3) ==
                            Math.floor(selectedDomCellIndex / 3)
                    ) {
                        $(this).toggleClass(relatedToActiveCellClass);
                    }
                });
        }
    });
}

/**
 * Highlights the currently selected table cell
 */
$('td').click(function () {
    if (currentlySelected != null) {
        toggleRelatedCells();
        currentlySelected.removeClass('active-cell');
    }

    currentlySelected = $(this);
    currentlySelected.addClass('active-cell');
    toggleRelatedCells();
});

/**
 * Reads the input from the keyboard and sets the value at
 * the cell that is currently selected
 */
document.addEventListener('keydown', function (event) {
    if (currentlySelected == null) {
        return true;
    }

    const key = event.key;
    if (isDeleteKey(key)) {
        return currentlySelected.html('');
    } else if (isValidSudokuInput(key)) {
        currentlySelected.html(key);
    }
});

const toggleModal = function (event) {
    $('.modal-overlay').toggleClass('active');
    if (event) {
        event.stopPropagation();
    }
};

$('#avatar').click(toggleModal);

$('body').click(function (event) {
    if (
        $('.modal-overlay').hasClass('active') &&
        !$(event.target).closest('#user-account-modal').length &&
        !$(event.target).is('#user-account-modal')
    ) {
        $('.modal-overlay').removeClass('active');
    }
});
