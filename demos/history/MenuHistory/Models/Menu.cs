using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MenuHistory.Models
{
	public class Menu
	{
		public Menu()
		{
			Items = new List<MenuItem>();
			Items.Add(new MenuItem()
			{
				Key = "Pancakes",
				Meal = "Breakfast",
				DishName = "Pancakes",
				DishDescription = "Pancakes are scratch-made with farm-fresh eggs and whole organic milk",
				IsSelected = false
			});
			Items.Add(new MenuItem()
			{
				Key = "ScrambledEggs",
				Meal = "Breakfast",
				DishName = "Scrambled Eggs",
				DishDescription = "Our perfect scambled eggs are filled with cheesy, buttery happiness",
				IsSelected = false
			});
			Items.Add(new MenuItem()
			{
				Key = "FrenchToast",
				Meal = "Breakfast",
				DishName = "French Toast",
				DishDescription = "Family-secret french toast recipe uses thick slices of bread and a touch of vanilla",
				IsSelected = false
			});

			Items.Add(new MenuItem()
			{
				Key = "FruitSalad",
				Meal = "Lunch",
				DishName = "Fruit Salad",
				DishDescription = "Only the freshest local, seasonal fruits go into this salad so this dish varies every day",
				IsSelected = false
			});
			Items.Add(new MenuItem()
			{
				Key = "GrilledCheese",
				Meal = "Lunch",
				DishName = "Grilled Cheese",
				DishDescription = "You can choose from a variety of fresh cheeses for the best grilled cheese of your life",
				IsSelected = false
			});
			Items.Add(new MenuItem()
			{
				Key = "Hamburger",
				Meal = "Lunch",
				DishName = "Hamburger",
				DishDescription = "Good luck finishing our 3/4 pound burger with fresh toppings and your choice of condiments",
				IsSelected = false
			});
			Items.Add(new MenuItem()
			{
				Key = "Steak",
				Meal = "Dinner",
				DishName = "Steak and a Side",
				DishDescription = "Open-fire grilled to order with no fooling around by our Texas-bred chef",
				IsSelected = false
			});
			Items.Add(new MenuItem()
			{
				Key = "ChickenPasta",
				Meal = "Dinner",
				DishName = "Chicken Alfredo",
				DishDescription = "Homemade alfredo pasta and sauce over fresh grilled chicken with a hint of lemon",
				IsSelected = false
			});
			Items.Add(new MenuItem()
			{
				Key = "BlackBeanTortilla",
				Meal = "Dinner",
				DishName = "Black Bean Tortilla",
				DishDescription = "Everything you need to satisfy a Tex-Mex appetite with guacamole and sour cream on the side",
				IsSelected = false
			});
		}
		public string SelectedMeal { get; set; }
		public List<MenuItem> Items { get; set; }
	}

	public class MenuItem
	{
		public string Key { get; set; }
		public string Meal { get; set; }
		public string DishName { get; set; }
		public string DishDescription { get; set; }
		public bool IsSelected { get; set; }
	}
}