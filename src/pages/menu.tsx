import React from "react";
import KeyList from "../components/keylist";
import { normalize, RenderItemProps } from "../types/generic";
import { SELTR } from ".";
import { useHistory } from "react-router";

interface MenuItem {
  id: number;
  name: string;
  route: string;
}

const MenuRoutes = [
  {
    id: 1,
    name: "Statements",
    route: "banks"
  },
  {
    id: 2,
    name: "Import Sales",
    route: "sales"
  }
];

export default () => {
  let history = useHistory();
  const menuItems = normalize<MenuItem>(MenuRoutes);
  const renderItem = (arg: RenderItemProps<MenuItem>) => {
    return (
      <SELTR selected={arg.isHighlighted}>
        <td>{arg.item.name}</td>
      </SELTR>
    );
  };

  const goBack = (_: number, __: string) => {
    history.goBack();
  };

  const handleEnter = (cursor: number) => {
    const selected = menuItems.normalized[menuItems.all[cursor]];
    history.push(selected.route);
  };

  const keyMap = [
    {
      key: 27,
      handler: goBack
    }
  ];

  const cursor = 0;
  return (
    <div>
      <KeyList
        columns={["Menu"]}
        cursor={cursor}
        data={menuItems}
        maxHeight={400}
        numberOfRows={8}
        width={"400px"}
        rowHeight={50}
        renderItem={renderItem}
        handleEnter={handleEnter}
        handleMisc={keyMap}
      />
    </div>
  );
};
