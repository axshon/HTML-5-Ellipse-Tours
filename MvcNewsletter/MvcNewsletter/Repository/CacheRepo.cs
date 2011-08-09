using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Json;

namespace MvcNewsletter.Repository
{
	public class CacheRepo
	{
		public static bool EmailExists(Cache cache, string email)
		{
			return (cache.Get(email.ToLower()) != null);
		}

		public static JsonValue AddUser(Cache cache, string email, string firstName, string lastName)
		{
			email = email.ToLower();
			var ret = new JsonObject();
			if (EmailExists(cache, email))
			{
				ret["email"] = email;
				ret["message"] = "Email already exists";
			}
			else
			{
				var cacheItm = new Tuple<string, string>(firstName, lastName);
				cache.Add(email, cacheItm, null, Cache.NoAbsoluteExpiration, new TimeSpan(0, 10, 0), CacheItemPriority.Normal, null);
				ret.AsDynamic().email = email;
				ret.AsDynamic().firstName = cacheItm.Item1;
				ret.AsDynamic().lastName = cacheItm.Item2;
				ret.AsDynamic().message = "Added";
			}
			return ret;
		}

		public static JsonValue GetUser(Cache cache, string email)
		{
			email = email.ToLower();
			var ret = new JsonObject();
			if (EmailExists(cache, email))
			{
				var cacheItm = cache[email] as Tuple<string, string>;
				ret["email"] = email;
				ret["firstName"] = cacheItm.Item1;
				ret["lastName"] = cacheItm.Item2;
				ret["message"] = "Found";
			}
			else
			{
				ret["email"] = email;
				ret["message"] = "Email not found";
			}
			return ret;
		}

		public static JsonValue GetAllUsers(Cache cache)
		{
			var ret = new JsonArray();
			foreach (var itm in cache)
			{
				if (itm is DictionaryEntry && ((DictionaryEntry)itm).Value is Tuple<string, string>)
				{
					ret.Add(GetUser(cache, ((DictionaryEntry)itm).Key.ToString()));
				}
			}
			return ret;
		}

		public static void ClearCache(Cache cache)
		{
			var itms = GetAllUsers(cache);
			foreach (var itm in itms)
			{
				var email = itm.Value["email"].ReadAs<string>();
				cache.Remove(email);
			}
		}
	}
}