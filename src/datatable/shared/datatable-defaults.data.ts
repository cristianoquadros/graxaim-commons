import { DataTableTranslations } from './datatable-translations.interface';
// export type HeaderCallback = (column: DataTableColumn) => string;

export var defaultTranslations = <DataTableTranslations>{
    indexColumn: 'índice',
    selectColumn: 'seleciona',
    expandColumn: 'espande',
    paginationLimit: 'Linhas',
    paginationRange: 'Resultado',
    emptyList: 'Nenhum registro listado!'
};
