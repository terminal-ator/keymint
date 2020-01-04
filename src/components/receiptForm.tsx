import React, { useState, useEffect, useRef } from "react";
import { NormalizedCache, DeNormalize } from "../types/generic";
import { Master } from "../types/master";
import { Receipt } from "../pages/receipt";
import { Select } from "./styledComp";
import "./rForm.css";

interface RecieptFormProps {
  MasterList: NormalizedCache<Master>;
  Receipt: Receipt;
  UpdateReceiptCash?(id: number, cash: number): void;
  Save(rec: Receipt): void;
}

const ReceiptForm = (props: RecieptFormProps) => {
  const denormMasters = DeNormalize<Master>(props.MasterList);
  const [cust_id, setCustID] = useState(0);
  const [cash, setCash] = useState(0);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [isTouched, setTouched] = useState(false);

  const handleSave = () => {
    const packet = {
      id: Math.floor(Math.random() * 930213),
      cust_id: cust_id,
      cash: cash
    };
    props.Save(packet);
    setCustID(0);
    setCash(0);
    if (selectRef && selectRef.current) {
      selectRef.current.focus();
    }
  };

  const handleUpdate = () => {
    if (props.UpdateReceiptCash) {
      props.UpdateReceiptCash(props.Receipt.id, cash);
      setTouched(false);
    }
  };

  useEffect(() => {
    setCustID(props.Receipt.cust_id);
    setCash(props.Receipt.cash);
  }, [props.Receipt]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
      }}
      className="receipt-form"
    >
      <Select
        value={cust_id}
        onChange={e => {
          if (props.Receipt.cust_id === 0) setCustID(parseInt(e.target.value));
        }}
        ref={selectRef}
        disabled={props.Receipt.cust_id!==0}
      >
        <option value={0} disabled>
          Choose a name
        </option>
        {denormMasters.map(master => (
          <option
            key={master.id}
            value={master.cust_id.Valid ? master.cust_id.Int64 : 0}
          >
            {master.name}
          </option>
        ))}
      </Select>
      <input
        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
          await setCash(parseInt(e.target.value));
          if (props.Receipt.cust_id !== 0) {
            setTouched(true);
          }
        }}
        type="number"
        placeholder="amount"
        value={cash}
      />
      {props.Receipt.cust_id === 0 ? (
        <button
          onClick={e => {
            e.preventDefault();
            handleSave();
          }}
          disabled={cust_id === 0}
        >
          Add
        </button>
      ) : null}
      {isTouched ? (
        <button
          onClick={e => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          Update
        </button>
      ) : null}
    </form>
  );
};

export default ReceiptForm;
