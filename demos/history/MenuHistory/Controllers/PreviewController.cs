using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MenuHistory.Models;

namespace MenuHistory.Controllers
{
	public class PreviewController : Controller
	{
		public PartialViewResult Index(string id)
		{
			var menu = new Menu();
			var item = menu.Items.Where(d => d.Key == id).FirstOrDefault();
			return PartialView("Index", item);
		}
	}
}
