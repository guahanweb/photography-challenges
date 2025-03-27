import { FiPlus, FiTrash2 } from 'react-icons/fi';

interface ArrayFieldProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  addLabel?: string;
  emptyMessage?: string;
  renderItem?: (
    value: string,
    onChange: (value: string) => void,
    onRemove: () => void
  ) => React.ReactNode;
}

export function ArrayField({
  label,
  items,
  onChange,
  addLabel = 'Add Item',
  emptyMessage = 'No items added',
  renderItem,
}: ArrayFieldProps) {
  const handleAdd = () => {
    onChange([...items, '']);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const defaultRenderItem = (
    value: string,
    onChange: (value: string) => void,
    onRemove: () => void
  ) => (
    <div className="flex gap-2 mt-2">
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="input" />
      <button
        type="button"
        onClick={onRemove}
        className="btn-caution btn-action"
        title="Remove Item"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="form-group">
      <label className="text-base font-normal">{label}</label>
      <div className="mt-2 space-y-2">
        {items.length === 0 ? (
          <div className="text-secondary text-sm">{emptyMessage}</div>
        ) : (
          items.map((item, index) => (
            <div key={index}>
              {(renderItem || defaultRenderItem)(
                item,
                value => handleChange(index, value),
                () => handleRemove(index)
              )}
            </div>
          ))
        )}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="btn-primary text-xs mt-4 flex items-center gap-2"
      >
        <FiPlus className="w-4 h-4" />
        <span>{addLabel}</span>
      </button>
    </div>
  );
}
