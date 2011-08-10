using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MvcNewsletter.Repository;
using System.Text.RegularExpressions;

namespace MvcNewsletter.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			ViewBag.Title = "Sign Up for Our Newsletter";
			ViewBag.Message = "Sign Up to Receive our Free Newsletter!";
			return View();
		}

		[HandleError]
		public ActionResult SignupNow(string emailAddr, string firstName, string lastName, string chkAgree)
		{
			// Test Business Rules again before adding to the store
			var validEmail = Regex.IsMatch(emailAddr, @"^[a-zA-Z][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$");
			var validFirstName = (firstName.Length >= 3 && firstName.Length <= 80);
			var validLastName = (lastName.Length >= 3 && lastName.Length <= 80);
			var validAgree = (chkAgree == "on");
			if (validEmail && validFirstName && validLastName && validAgree)
			{
				var tst = CacheRepo.AddUser(HttpContext.Cache, emailAddr, firstName, lastName);
				if (tst["message"].ReadAs<string>() == "Email already exists")
				{
					return View("Confirmation", false);
				}
				else
				{
					return View("Confirmation", true);
				}
			}
			else
			{
				throw new Exception("Business Rule Failure");
			}
		}

		public ActionResult About()
		{
			//return RedirectToAction("Register", "Account");
			return View();
		}
	}
}
