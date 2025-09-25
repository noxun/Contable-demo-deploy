export interface IAuthBillingRespose {
  code: number;
  data: {
    token: string;
  };
}

export interface IResponseInvoice {
  invoice_id: number;
  customer_id: number;
  customer: string;
  user_id: number;
  store_id: number;
  nit_ruc_nif: string;
  tax_id: number;
  tax_rate: number;
  subtotal: number;
  total_tax: number;
  discount: number;
  monto_giftcard: number;
  total: number;
  cash: number;
  invoice_number: number;
  control_code: string;
  authorization: string;
  invoice_date_time: string;
  invoice_limite_date: null;
  currency_code: string;
  status: string;
  codigo_sucursal: number;
  punto_venta: number;
  actividad_economica: number;
  codigo_documento_sector: number;
  tipo_documento_identidad: number;
  codigo_metodo_pago: number;
  codigo_moneda: number;
  cufd: string;
  cuf: string;
  cafc: string;
  complemento: string;
  numero_tarjeta: string;
  tipo_cambio: number;
  evento_id: number;
  siat_id: string;
  tipo_emision: number;
  tipo_factura_documento: number;
  nit_emisor: number;
  ambiente: number;
  data: {};
  last_modification_date: string;
  creation_date: string;
  items: IResponseInvoiceItem[];
  siat_url: string;
  print_url: string;
  sector: string;
  leyenda: string;
}
export interface IResponseInvoiceItem {
  item_id: number;
  invoice_id: number;
  store_id: number;
  product_id: number;
  product_code: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
  discount: number;
  codigo_actividad: number;
  codigo_producto_sin: number;
  unidad_medida: number;
  numero_serie: string;
  numero_imei: string;
  user_id: number;
  data: string;
  last_modification_date: string;
  creation_date: string;
}
