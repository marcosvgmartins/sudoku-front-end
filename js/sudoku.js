var currentlySelected = null;

function isValidSudokuInput(value) {
    return value >= '1' && value <= '9';
}

/**
 * TODO
 *  1. Simplify highlight/deemphasize logic (use a single method and JQuery's "toggleClass")
 *  2. Improve variable names
 */

function highlightRelatedCells() {
    selectedDomCell = currentlySelected[0];
    var cellIndex = selectedDomCell.cellIndex;
    var parentRow = selectedDomCell.parentElement;
    var rowIndex = parentRow.rowIndex;

    /**
     * Highlight everything on the same row
     */
    $(parentRow).find("td").each(function() {
        $(this).addClass("related-to-active-cell");
    });

    /**
     * Highlight everything on the same column and on the same subregion
     */
    $("#sudoku-board tr").each(function() {

        $(this.cells[cellIndex]).addClass("related-to-active-cell");

        var currentRowSubRegion = Math.floor(this.rowIndex / 3);
        var selectedCellRowSubRegion = Math.floor(rowIndex / 3);
        if (currentRowSubRegion == selectedCellRowSubRegion) {
            $(this).find("td").each(function() {
                if (Math.floor(this.cellIndex / 3) == Math.floor(cellIndex / 3)) {
                    $(this).addClass("related-to-active-cell");
                }
            });
        }
    });

    currentlySelected.removeClass("related-to-active-cell");
}

function deemphasizeRelatedCells() {
    selectedDomCell = currentlySelected[0];
    var cellIndex = selectedDomCell.cellIndex;
    var parentRow = selectedDomCell.parentElement;
    var rowIndex = parentRow.rowIndex;

    $(parentRow).find("td").each(function() {
        if ($(this) != currentlySelected) {
            $(this).removeClass("related-to-active-cell");
        }
    });

    /**
     * Deemphasize everything on the same column
     */
    $("#sudoku-board tr").each(function() {

        $(this.cells[cellIndex]).removeClass("related-to-active-cell");

        var currentRowSubRegion = Math.floor(this.rowIndex / 3);
        var selectedCellRowSubRegion = Math.floor(rowIndex / 3);
        if (currentRowSubRegion == selectedCellRowSubRegion) {
            $(this).find("td").each(function() {
                if (Math.floor(this.cellIndex / 3) == Math.floor(cellIndex / 3)) {
                    $(this).removeClass("related-to-active-cell");
                }
            });
        }
    });
}

/**
 * Highlights the currently selected table cell
 */
$("td").click(function() {
    if (currentlySelected != null) {
        deemphasizeRelatedCells();
        currentlySelected.removeClass("active-cell");
    }

    currentlySelected = $(this);
    currentlySelected.addClass("active-cell");
    highlightRelatedCells();
});

/**
 * Reads the input from the keyboard and sets the value at
 * the cell that is currently selected
 */
document.addEventListener("keypress", function onPress(event) {

    if (currentlySelected != null) {
        if (isValidSudokuInput(event.key)) {
            currentlySelected.html(event.key);
        }
    }
});