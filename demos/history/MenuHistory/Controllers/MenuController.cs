using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MenuHistory.Controllers
{
	public class MenuController : Controller
	{

		public ActionResult Index(string meal = "", string dish = "")
		{
			var menu = new Models.Menu();
			menu.SelectedMeal = meal;
			var selected = menu.Items
				.Where(s => s.Meal == meal && s.Key == dish)
				.FirstOrDefault();
			if (selected != null)
				selected.IsSelected = true;
			return View(menu);
		}

	}
}
