import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

const Header = ({ headers, onSorting }) => {
  const [sortingField, setSortingField] = useState("");
  const [sortingOrder, setSortingOrder] = useState("asc");

  const onSortingChange = (field) => {
    const order =
      field === sortingField && sortingOrder === "asc" ? "desc" : "asc";
    setSortingField(field);
    setSortingOrder(order);
    onSorting(field, order);
  };

  return (
    <thead>
      <tr>
        {headers.map(({ name, field, sortable }) => (
          <th
            key={name}
            onClick={() => (sortable ? onSortingChange(field) : null)}
            style={sortable ? {cursor:'pointer'} : null}
          >
            {name}
            {sortingField && sortingField === field && (
              <>
                &nbsp;
                <FontAwesomeIcon
                  icon={sortingOrder === "asc" ? faArrowDown : faArrowUp}
                />
              </>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default Header;
