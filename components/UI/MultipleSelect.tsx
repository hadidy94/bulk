import { useState } from 'react';
import Select, { OnChangeValue } from 'react-select';


export default function MultipleSelectCheckmarks({options}) {

  const [selected, setSelected] = useState([]);

  const onChange = (selectedOptions: OnChangeValue<options, true>) => {
    setSelected(selectedOptions);
  }

  return (
    <Select
      isClearable
      isMulti
      name="sellers[]"
      options={options}
      value={selected}
      onChange={onChange}
      getOptionValue={(option) => `${option['id']}`}
    />
  );
}