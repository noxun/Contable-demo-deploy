export interface IBillingRespose {
  code: number;
  data: {
    token: string;
  };
}
export interface IFactura {
  customer_id: number;
  customer: string;
  nit_ruc_nif: string | null;
  subtotal: number;
  total_tax: number;
  discount: string;
  monto_giftcard: string;
  total: number;
  invoice_date_time: string;
  currency_code: string;
  codigo_sucursal: number;
  punto_venta: number;
  codigo_documento_sector: number;
  tipo_documento_identidad: number;
  codigo_metodo_pago: number;
  codigo_moneda: number;
  complemento: string | null;
  numero_tarjeta: number | null;
  tipo_cambio: number;
  tipo_factura_documento: number;
  items: IFacturaItems[];
  data: object;
}
export interface IFacturaItems {
  product_id: number;
  product_code: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
  unidad_medida: number;
  numero_serie: string;
  numero_imei: string;
  codigo_producto_sin: number;
  codigo_actividad: string;
  discount: number;
}
export interface IDispatchDocument {
  id: string;
  num: string;
  numRef: string;
  totalSheet: number;
  totalSheetString: string;
  totalInvoice: number;
  totalInvoiceString: string;
  totalProcedure: number;
  totalProcedureString: string;
  url1: string;
  url2: string;
  registerDate: string;
}
