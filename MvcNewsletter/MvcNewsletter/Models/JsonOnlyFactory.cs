using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.ApplicationServer.Http.Description;
using System.Collections.ObjectModel;

namespace MvcNewsletter
{
	internal class JsonOnlyFactory : HttpOperationHandlerFactory
	{
		protected override Collection<Microsoft.ApplicationServer.Http.Dispatcher.HttpOperationHandler> OnCreateRequestHandlers(System.ServiceModel.Description.ServiceEndpoint endpoint, HttpOperationDescription operation)
		{
			var coll = base.OnCreateRequestHandlers(endpoint, operation);
			this.Formatters.Remove(Formatters.XmlFormatter);
			return coll;
			// return base.OnCreateRequestHandlers(endpoint, operation);
		}
	}
}