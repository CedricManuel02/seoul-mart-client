import React, {  } from "react";
import { IProduct } from "@/_interface/interface";
import ItemWrapper from "./item-wrapper";

export default function ItemContainer({ item, session }: { item: IProduct, session: any }) {
    return (
       <React.Fragment>
        <ItemWrapper item={item} session={session}/>
       </React.Fragment>
    );
}
