import { Context } from "./context";

export interface RouterRenderedComponent {
    fetchData(context: Context, props: any): Promise<any>;
}
