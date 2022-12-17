package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

@Controller
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;

    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public String showAllUsers(@AuthenticationPrincipal User user, ModelMap model) {
        model.addAttribute("users", userService.listUsers());
        model.addAttribute("principial", user);
        model.addAttribute("roles", roleService.getAllRoles());
        return "admin/admin";
    }

    @GetMapping("/user/new")
    public String newUserPage(@AuthenticationPrincipal User user, ModelMap model) {
        model.addAttribute("user", new User());
        model.addAttribute("principial", user);
        model.addAttribute("roles", roleService.getAllRoles());
        return "admin/newUser";
    }

    @PostMapping("/user")
    public String addUser(@ModelAttribute("user") User user) {
        userService.add(user);
        return "redirect:/admin";
    }

    @PatchMapping("/{id}")
    public String update(@ModelAttribute("user") User user) {
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
