var currentlySelected = null;
const relatedToActiveCellClass = "related-to-active-cell"

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
    $(selectedCellParentRow).find("td").each(function() {
        if (this.cellIndex != selectedDomCellIndex) {
            $(this).toggleClass(relatedToActiveCellClass);
        }
    });

    /**
     * Toggle everything on the same column and on the same subregion
     */
    $("#sudoku-board tr").each(function() {

        if (this.rowIndex == parentRowIndex) {
            return;
        }

        // This will access the same column
        $(this.cells[selectedDomCellIndex]).toggleClass(relatedToActiveCellClass);

        // This will access the cells at the same subregion
        var currentRowSubRegion = Math.floor(this.rowIndex / 3);
        var selectedCellRowSubRegion = Math.floor(parentRowIndex / 3);
        if (currentRowSubRegion == selectedCellRowSubRegion) {
            $(this).find("td").each(function() {
                if (this.cellIndex != selectedDomCellIndex &&
                    Math.floor(this.cellIndex / 3) == Math.floor(selectedDomCellIndex / 3)) {
                    $(this).toggleClass(relatedToActiveCellClass);
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
        toggleRelatedCells();
        currentlySelected.removeClass("active-cell");
    }

    currentlySelected = $(this);
    currentlySelected.addClass("active-cell");
    toggleRelatedCells();
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