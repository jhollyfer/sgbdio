export interface Exception {
  message: string;
  code: number;
  cause: string;
  errors?: Record<string, string>;
}

export default class HTTPException extends Error {
  public readonly code: number;
  public override readonly cause: string;
  public errors?: Record<string, string>;

  protected constructor(payload: Exception) {
    super(payload.message);
    this.cause = payload.cause;
    this.code = payload.code;

    if (payload.errors) {
      this.errors = payload.errors;
    }
  }

  // Métodos estáticos para cada código HTTP de erro 4xx e 5xx

  // 4xx Client Errors
  static BadRequest(
    message = 'Bad Request',
    cause = 'INVALID_PARAMETERS',
    errors?: Record<string, string>,
  ): HTTPException {
    return new HTTPException({ message, code: 400, cause, errors });
  }

  static Unauthorized(
    message = 'Unauthorized',
    cause = 'AUTHENTICATION_REQUIRED',
    errors?: Record<string, string>,
  ): HTTPException {
    return new HTTPException({ message, code: 401, cause, errors });
  }

  static PaymentRequired(
    message = 'Payment Required',
    cause = 'PAYMENT_REQUIRED',
  ): HTTPException {
    return new HTTPException({ message, code: 402, cause });
  }

  static Forbidden(
    message = 'Forbidden',
    cause = 'ACCESS_DENIED',
    errors?: Record<string, string>,
  ): HTTPException {
    return new HTTPException({ message, code: 403, cause, errors });
  }

  static NotFound(
    message = 'Not Found',
    cause = 'RESOURCE_NOT_FOUND',
    errors?: Record<string, string>,
  ): HTTPException {
    return new HTTPException({ message, code: 404, cause, errors });
  }

  static MethodNotAllowed(
    message = 'Method Not Allowed',
    cause = 'INVALID_HTTP_METHOD',
  ): HTTPException {
    return new HTTPException({ message, code: 405, cause });
  }

  static NotAcceptable(
    message = 'Not Acceptable',
    cause = 'REQUEST_NOT_ACCEPTABLE',
  ): HTTPException {
    return new HTTPException({ message, code: 406, cause });
  }

  static ProxyAuthenticationRequired(
    message = 'Proxy Authentication Required',
    cause = 'PROXY_AUTHENTICATION_REQUIRED',
  ): HTTPException {
    return new HTTPException({ message, code: 407, cause });
  }

  static RequestTimeout(
    message = 'Request Timeout',
    cause = 'REQUEST_TIMEOUT',
  ): HTTPException {
    return new HTTPException({ message, code: 408, cause });
  }

  static Conflict(
    message = 'Conflict',
    cause = 'CONFLICT_IN_REQUEST',
    errors?: Record<string, string>,
  ): HTTPException {
    return new HTTPException({ message, code: 409, cause, errors });
  }

  static Gone(message = 'Gone', cause = 'RESOURCE_GONE'): HTTPException {
    return new HTTPException({ message, code: 410, cause });
  }

  static LengthRequired(
    message = 'Length Required',
    cause = 'CONTENT_LENGTH_REQUIRED',
  ): HTTPException {
    return new HTTPException({ message, code: 411, cause });
  }

  static PreconditionFailed(
    message = 'Precondition Failed',
    cause = 'PRECONDITION_NOT_MET',
    errors?: Record<string, string>,
  ): HTTPException {
    return new HTTPException({ message, code: 412, cause, errors });
  }

  static PayloadTooLarge(
    message = 'Payload Too Large',
    cause = 'PAYLOAD_TOO_LARGE',
  ): HTTPException {
    return new HTTPException({ message, code: 413, cause });
  }

  static URITooLong(
    message = 'URI Too Long',
    cause = 'URI_TOO_LONG',
  ): HTTPException {
    return new HTTPException({ message, code: 414, cause });
  }

  static UnsupportedMediaType(
    message = 'Unsupported Media Type',
    cause = 'UNSUPPORTED_MEDIA_TYPE',
  ): HTTPException {
    return new HTTPException({ message, code: 415, cause });
  }

  static RangeNotSatisfiable(
    message = 'Range Not Satisfiable',
    cause = 'RANGE_NOT_SATISFIABLE',
  ): HTTPException {
    return new HTTPException({ message, code: 416, cause });
  }

  static ExpectationFailed(
    message = 'Expectation Failed',
    cause = 'EXPECTATION_FAILED',
  ): HTTPException {
    return new HTTPException({ message, code: 417, cause });
  }

  static IAmATeapot(
    message = "I'm a teapot",
    cause = 'TEAPOT_ERROR',
  ): HTTPException {
    return new HTTPException({ message, code: 418, cause });
  }

  static MisdirectedRequest(
    message = 'Misdirected Request',
    cause = 'MISDIRECTED_REQUEST',
  ): HTTPException {
    return new HTTPException({ message, code: 421, cause });
  }

  static UnprocessableEntity(
    message = 'Unprocessable Entity',
    cause = 'UNPROCESSABLE_ENTITY',
  ): HTTPException {
    return new HTTPException({ message, code: 422, cause });
  }

  static Locked(message = 'Locked', cause = 'RESOURCE_LOCKED'): HTTPException {
    return new HTTPException({ message, code: 423, cause });
  }

  static FailedDependency(
    message = 'Failed Dependency',
    cause = 'FAILED_DEPENDENCY',
  ): HTTPException {
    return new HTTPException({ message, code: 424, cause });
  }

  static TooEarly(message = 'Too Early', cause = 'TOO_EARLY'): HTTPException {
    return new HTTPException({ message, code: 425, cause });
  }

  static UpgradeRequired(
    message = 'Upgrade Required',
    cause = 'UPGRADE_REQUIRED',
  ): HTTPException {
    return new HTTPException({ message, code: 426, cause });
  }

  static PreconditionRequired(
    message = 'Precondition Required',
    cause = 'PRECONDITION_REQUIRED',
  ): HTTPException {
    return new HTTPException({ message, code: 428, cause });
  }

  static TooManyRequests(
    message = 'Too Many Requests',
    cause = 'TOO_MANY_REQUESTS',
  ): HTTPException {
    return new HTTPException({ message, code: 429, cause });
  }

  static RequestHeaderFieldsTooLarge(
    message = 'Request Header Fields Too Large',
    cause = 'HEADER_FIELDS_TOO_LARGE',
  ): HTTPException {
    return new HTTPException({ message, code: 431, cause });
  }

  static UnavailableForLegalReasons(
    message = 'Unavailable For Legal Reasons',
    cause = 'LEGAL_RESTRICTIONS',
  ): HTTPException {
    return new HTTPException({ message, code: 451, cause });
  }

  // 5xx Server Errors
  static InternalServerError(
    message = 'Internal Server Error',
    cause = 'SERVER_ERROR',
  ): HTTPException {
    return new HTTPException({ message, code: 500, cause });
  }

  static NotImplemented(
    message = 'Not Implemented',
    cause = 'NOT_IMPLEMENTED',
  ): HTTPException {
    return new HTTPException({ message, code: 501, cause });
  }

  static BadGateway(
    message = 'Bad Gateway',
    cause = 'BAD_GATEWAY',
  ): HTTPException {
    return new HTTPException({ message, code: 502, cause });
  }

  static ServiceUnavailable(
    message = 'Service Unavailable',
    cause = 'SERVICE_UNAVAILABLE',
  ): HTTPException {
    return new HTTPException({ message, code: 503, cause });
  }

  static GatewayTimeout(
    message = 'Gateway Timeout',
    cause = 'GATEWAY_TIMEOUT',
  ): HTTPException {
    return new HTTPException({ message, code: 504, cause });
  }

  static HTTPVersionNotSupported(
    message = 'HTTP Version Not Supported',
    cause = 'HTTP_VERSION_NOT_SUPPORTED',
  ): HTTPException {
    return new HTTPException({ message, code: 505, cause });
  }

  static VariantAlsoNegotiates(
    message = 'Variant Also Negotiates',
    cause = 'VARIANT_NEGOTIATION_ERROR',
  ): HTTPException {
    return new HTTPException({ message, code: 506, cause });
  }

  static InsufficientStorage(
    message = 'Insufficient Storage',
    cause = 'INSUFFICIENT_STORAGE',
  ): HTTPException {
    return new HTTPException({ message, code: 507, cause });
  }

  static LoopDetected(
    message = 'Loop Detected',
    cause = 'LOOP_DETECTED',
  ): HTTPException {
    return new HTTPException({ message, code: 508, cause });
  }

  static NotExtended(
    message = 'Not Extended',
    cause = 'NOT_EXTENDED',
  ): HTTPException {
    return new HTTPException({ message, code: 510, cause });
  }

  static NetworkAuthenticationRequired(
    message = 'Network Authentication Required',
    cause = 'NETWORK_AUTHENTICATION_REQUIRED',
  ): HTTPException {
    return new HTTPException({ message, code: 511, cause });
  }
}
