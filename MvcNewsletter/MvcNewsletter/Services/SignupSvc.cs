using System.Json;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Web;
using MvcNewsletter.Repository;

namespace MvcNewsletter.Services
{
	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class SignupSvc
	{
		[WebGet(UriTemplate = "")]
		public JsonValue GetAllUsers()
		{
			var ret = CacheRepo.GetAllUsers(HttpContext.Current.Cache);
			return ret;
		}

		[WebGet(UriTemplate = "/{email}")]
		public JsonValue GetUser(string email)
		{
			var ret = CacheRepo.GetUser(HttpContext.Current.Cache, email);
			return ret;
		}
	}
}