import { DataTable } from 'primereact/datatable';

interface SelectionPanelProps {
  tableRef: React.RefObject<DataTable>;
  selectedArtworks: Set<number>;
  totalRecords: number;
  onToggleAll: (selectAll: boolean) => void;
}

export const SelectionPanel = ({
  tableRef,
  selectedArtworks,
  totalRecords,
  onToggleAll,
}: SelectionPanelProps) => {
  const selectedCount = selectedArtworks.size;
  const isAllSelected = selectedCount === totalRecords && totalRecords > 0;

  return (
    <div className="flex justify-content-between align-items-center p-2 border-bottom-1 surface-border">
      <div>
        <span className="font-medium">
          {selectedCount} of {totalRecords} selected
        </span>
      </div>
      <div>
        <button
          className="p-button p-button-text p-button-sm"
          onClick={() => onToggleAll(!isAllSelected)}
        >
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>
    </div>
  );
};