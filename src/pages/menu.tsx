import React from "react";
import KeyList from "../components/keylist";
import { normalize, RenderItemProps } from "../types/generic";
import { SELTR } from ".";
import { useHistory } from "react-router";
import { PageDiv } from "../components/styledComp";
import Nav from "../components/nav";
import ImKeyList from "../components/ImprovedKeyList";

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
  },
  {
    id: 7,
    name: "Add Cheques",
    route: "receipt"
  },
  {
    id: 6,
    name: 'Import Statement',
    route: 'imrstat',
  },
  {
    id: 4,
    name: "Ledgers",
    route: "ledgers"
  },
  {
    id: 5,
    name: "Errors",
    route: "errors"
  },
  {
    id:8,
    name:"Day Book",
    route: "daybook"
  },
  {
    id:9,
    name: "Pending Cheques",
    route: "pending"
  },
  {
    id: 10,
    name: "Products",
    route: "products"
  },
  {
    id:11,
    name: "Orders",
    route: "orders"
  },
  {
    id: 12,
    name: "Approvals",
    route: "approvals"
  },
  {
    id:13,
    name: "Trials",
    route: "trial"
  }
];

export default () => {
  let history = useHistory();
  const menuItems = normalize<MenuItem>(MenuRoutes);
  const renderItem = (arg: RenderItemProps<MenuItem>) => {
    return (
      <SELTR>
        <td>{arg.item.name}</td>
      </SELTR>
    );
  };

  const goBack = (_: number, __: string) => {
    history.goBack();
  };

  const handleEnter = (cursor: number) => {
    const selected = menuItems.normalized[cursor];
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
    <PageDiv>
      <Nav />
      <div style={{ maxWidth: "250px", marginLeft: 10}}>
        <ImKeyList
          columns={["Menu"]}
          cursor={cursor}
          data={MenuRoutes}
          maxHeight={400}
          numberOfRows={12}
          width={"150px"}
          rowHeight={40}
          renderItem={renderItem}
          handleEnter={handleEnter}
          handleMisc={keyMap}
          autoFocus={true}
        />
        {/*<ImKeyList cursor={cursor} data={MenuRoutes}*/}
        {/*           renderItem={renderItem}*/}
        {/*           autoFocus={true}*/}
        {/*           scrollMode={true}*/}
        {/*           columns={["menu"]} rowHeight={40} numberOfRows={2} maxHeight={400} />*/}
      </div>
    </PageDiv>
  );
};
