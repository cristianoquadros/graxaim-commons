import { TestBed, inject } from '@angular/core/testing';

import { CsvConvertService } from './csv-convert.service';

describe('CsvConvertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CsvConvertService]
    });
  });

  it('Create service...', inject([CsvConvertService], (service: CsvConvertService) => {
    expect(service).toBeTruthy();
  }));


  it('Convertendo array para CSV', inject([CsvConvertService], (service: CsvConvertService) => {
    let jsonTest = [{'Nome':'Teste1', 'Idade': 10}, {'Nome':'Teste2', 'Idade': 20}];
    let csvStr = service.toCSV(jsonTest)
    expect(csvStr).toEqual('Nome;Idade\r\nTeste1;10\r\nTeste2;20\r\n');
  }));  
});

