/// <reference path='../_all.ts' />

module angularCmf.resource {
    export interface IPhpcrResource extends IResource {
        repository_alias: string;
        repository_type: string;
        payload_alias: string;
        payload_type: string;
        path: string;
        node_name: string;
        label: string;
        repository_path: string;
        children: Array<IPhpcrResource>;
    }
}
